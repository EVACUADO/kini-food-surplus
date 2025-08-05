/*
  # Kini Food Surplus Database Schema

  1. New Tables
    - `profiles` - User profiles for customers and merchants
    - `merchants` - Merchant business information and verification
    - `products` - Surplus food products listed by merchants
    - `orders` - Customer orders for surplus products
    - `messages` - Chat messages between customers and merchants
    - `tokens` - Merchant token purchases and usage
    - `admin_logs` - System administration logs

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on user roles
    - Separate policies for customers, merchants, and admins

  3. Functions
    - User role management
    - Token system for merchants
    - Order processing
    - Waste reduction calculations
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'merchant', 'admin', 'agent');
CREATE TYPE merchant_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'ready', 'completed', 'cancelled');
CREATE TYPE product_status AS ENUM ('active', 'sold_out', 'expired', 'removed');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  mobile text,
  role user_role NOT NULL DEFAULT 'customer',
  location text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Merchants table
CREATE TABLE IF NOT EXISTS merchants (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_email text NOT NULL,
  phone text NOT NULL,
  business_location text NOT NULL,
  bank_details text NOT NULL,
  status merchant_status DEFAULT 'pending',
  dti_certificate_url text,
  bir_certificate_url text,
  business_permit_url text,
  verification_notes text,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  tokens_balance integer DEFAULT 0,
  total_sales decimal(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  waste_reduced_kg decimal(8,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  original_price decimal(8,2) NOT NULL,
  discounted_price decimal(8,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  available_quantity integer NOT NULL DEFAULT 1,
  expiry_date date NOT NULL,
  image_url text,
  status product_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_prices CHECK (discounted_price < original_price),
  CONSTRAINT valid_quantity CHECK (available_quantity <= quantity),
  CONSTRAINT future_expiry CHECK (expiry_date >= CURRENT_DATE)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(8,2) NOT NULL,
  total_amount decimal(8,2) NOT NULL,
  status order_status DEFAULT 'pending',
  pickup_time timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_order_quantity CHECK (quantity > 0),
  CONSTRAINT valid_total CHECK (total_amount = unit_price * quantity)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT different_users CHECK (sender_id != recipient_id)
);

-- Tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  price decimal(8,2) NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  used_count integer DEFAULT 0,
  
  CONSTRAINT valid_token_amount CHECK (amount > 0),
  CONSTRAINT valid_usage CHECK (used_count <= amount)
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Merchants policies
CREATE POLICY "Merchants can read own data"
  ON merchants
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Merchants can update own data"
  ON merchants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Agents can read all merchants"
  ON merchants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

CREATE POLICY "Agents can update merchant status"
  ON merchants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Products policies
CREATE POLICY "Anyone can read active products"
  ON products
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Merchants can manage own products"
  ON products
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    merchant_id = auth.uid()
  );

CREATE POLICY "Customers can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Merchants can update order status"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (merchant_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Tokens policies
CREATE POLICY "Merchants can read own tokens"
  ON tokens
  FOR SELECT
  TO authenticated
  USING (merchant_id = auth.uid());

CREATE POLICY "Merchants can purchase tokens"
  ON tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (merchant_id = auth.uid());

-- Admin logs policies
CREATE POLICY "Admins can read all logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Functions

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to calculate discounted price (70% off)
CREATE OR REPLACE FUNCTION calculate_discount_price(original_price decimal)
RETURNS decimal AS $$
BEGIN
  RETURN ROUND(original_price * 0.3, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update product availability after order
CREATE OR REPLACE FUNCTION update_product_availability()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease available quantity when order is created
    UPDATE products 
    SET available_quantity = available_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Mark as sold out if no quantity left
    UPDATE products 
    SET status = 'sold_out'
    WHERE id = NEW.product_id AND available_quantity <= 0;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- If order is cancelled, restore quantity
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      UPDATE products 
      SET available_quantity = available_quantity + NEW.quantity,
          status = CASE WHEN status = 'sold_out' THEN 'active' ELSE status END
      WHERE id = NEW.product_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for product availability
CREATE TRIGGER update_product_availability_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_product_availability();

-- Function to use merchant tokens
CREATE OR REPLACE FUNCTION use_merchant_token(merchant_uuid uuid)
RETURNS boolean AS $$
DECLARE
  available_tokens integer;
BEGIN
  -- Check available tokens
  SELECT tokens_balance INTO available_tokens
  FROM merchants
  WHERE id = merchant_uuid;
  
  IF available_tokens > 0 THEN
    -- Deduct one token
    UPDATE merchants
    SET tokens_balance = tokens_balance - 1
    WHERE id = merchant_uuid;
    
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add tokens to merchant
CREATE OR REPLACE FUNCTION add_merchant_tokens(merchant_uuid uuid, token_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE merchants
  SET tokens_balance = tokens_balance + token_amount
  WHERE id = merchant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get merchant statistics
CREATE OR REPLACE FUNCTION get_merchant_stats(merchant_uuid uuid)
RETURNS TABLE(
  total_sales decimal,
  total_orders integer,
  waste_reduced_kg decimal,
  active_products integer,
  pending_orders integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.total_sales,
    m.total_orders,
    m.waste_reduced_kg,
    (SELECT COUNT(*)::integer FROM products WHERE merchant_id = merchant_uuid AND status = 'active'),
    (SELECT COUNT(*)::integer FROM orders WHERE merchant_id = merchant_uuid AND status = 'pending')
  FROM merchants m
  WHERE m.id = merchant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get platform analytics
CREATE OR REPLACE FUNCTION get_platform_analytics()
RETURNS TABLE(
  total_users integer,
  total_merchants integer,
  total_orders integer,
  total_waste_reduced decimal,
  total_revenue decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::integer FROM profiles WHERE role = 'customer'),
    (SELECT COUNT(*)::integer FROM merchants WHERE status = 'approved'),
    (SELECT COUNT(*)::integer FROM orders),
    (SELECT COALESCE(SUM(waste_reduced_kg), 0) FROM merchants),
    (SELECT COALESCE(SUM(total_sales), 0) FROM merchants);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_products_merchant_status ON products(merchant_id, status);
CREATE INDEX IF NOT EXISTS idx_products_expiry ON products(expiry_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_tokens_merchant ON tokens(merchant_id);