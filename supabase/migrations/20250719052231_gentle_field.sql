/*
  # Add Customer Features Database Schema

  1. New Tables
    - `customer_favorites` - Save favorite merchants and products
    - `customer_addresses` - Multiple delivery addresses per customer
    - `customer_preferences` - Food preferences and dietary restrictions
    - `notifications` - Push notifications for users
    - `reviews` - Customer reviews for merchants and products
    - `loyalty_points` - Customer loyalty program
    - `customer_analytics` - Track customer behavior and savings

  2. Security
    - Enable RLS on all new tables
    - Add policies for customers to manage their own data
    - Add policies for merchants to read relevant customer data

  3. Functions
    - Calculate customer savings
    - Update loyalty points
    - Send notifications
*/

-- Customer Favorites Table
CREATE TABLE IF NOT EXISTS customer_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  merchant_id uuid REFERENCES merchants(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('merchant', 'product')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, merchant_id, type),
  UNIQUE(customer_id, product_id, type)
);

ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage own favorites"
  ON customer_favorites
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Customer Addresses Table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  province text NOT NULL,
  postal_code text,
  country text NOT NULL DEFAULT 'Philippines',
  latitude decimal(10,8),
  longitude decimal(11,8),
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage own addresses"
  ON customer_addresses
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Customer Preferences Table
CREATE TABLE IF NOT EXISTS customer_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dietary_restrictions text[] DEFAULT '{}',
  food_categories text[] DEFAULT '{}',
  max_distance_km integer DEFAULT 10,
  preferred_pickup_times text[] DEFAULT '{}',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}',
  language text DEFAULT 'en',
  currency text DEFAULT 'PHP',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id)
);

ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage own preferences"
  ON customer_preferences
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('order', 'message', 'promotion', 'system', 'merchant_update')),
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  merchant_id uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_anonymous boolean DEFAULT false,
  merchant_reply text,
  merchant_reply_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, order_id)
);

CREATE INDEX idx_reviews_merchant_rating ON reviews(merchant_id, rating);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage own reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Merchants can read reviews and reply"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (merchant_id = auth.uid());

CREATE POLICY "Merchants can update replies"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (merchant_id = auth.uid())
  WITH CHECK (merchant_id = auth.uid());

CREATE POLICY "Anyone can read public reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Loyalty Points Table
CREATE TABLE IF NOT EXISTS loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points_earned integer NOT NULL DEFAULT 0,
  points_used integer NOT NULL DEFAULT 0,
  current_balance integer NOT NULL DEFAULT 0,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'used', 'expired', 'bonus')),
  description text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_loyalty_points_customer ON loyalty_points(customer_id, created_at);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own loyalty points"
  ON loyalty_points
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Customer Analytics Table
CREATE TABLE IF NOT EXISTS customer_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_orders integer DEFAULT 0,
  total_spent numeric(10,2) DEFAULT 0,
  total_saved numeric(10,2) DEFAULT 0,
  waste_prevented_kg numeric(8,2) DEFAULT 0,
  favorite_categories text[] DEFAULT '{}',
  avg_order_value numeric(8,2) DEFAULT 0,
  last_order_date timestamptz,
  loyalty_tier text DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id)
);

ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own analytics"
  ON customer_analytics
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "System can update analytics"
  ON customer_analytics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add missing columns to existing tables
DO $$
BEGIN
  -- Add rating to merchants table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'merchants' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE merchants ADD COLUMN average_rating numeric(3,2) DEFAULT 0;
    ALTER TABLE merchants ADD COLUMN total_reviews integer DEFAULT 0;
  END IF;

  -- Add customer analytics columns to profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login timestamptz;
    ALTER TABLE profiles ADD COLUMN is_verified boolean DEFAULT false;
    ALTER TABLE profiles ADD COLUMN verification_token text;
  END IF;
END $$;

-- Functions for customer features

-- Function to calculate customer savings
CREATE OR REPLACE FUNCTION calculate_customer_savings(customer_uuid uuid)
RETURNS numeric AS $$
DECLARE
  total_savings numeric := 0;
BEGIN
  SELECT COALESCE(SUM(
    (p.original_price - o.unit_price) * o.quantity
  ), 0)
  INTO total_savings
  FROM orders o
  JOIN products p ON o.product_id = p.id
  WHERE o.customer_id = customer_uuid
    AND o.status = 'completed';
  
  RETURN total_savings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update loyalty points
CREATE OR REPLACE FUNCTION update_loyalty_points(customer_uuid uuid, order_uuid uuid, points_to_add integer)
RETURNS void AS $$
DECLARE
  current_points integer := 0;
BEGIN
  -- Get current balance
  SELECT COALESCE(SUM(
    CASE 
      WHEN transaction_type = 'earned' OR transaction_type = 'bonus' THEN points_earned
      WHEN transaction_type = 'used' THEN -points_used
      ELSE 0
    END
  ), 0)
  INTO current_points
  FROM loyalty_points
  WHERE customer_id = customer_uuid;

  -- Add new points
  INSERT INTO loyalty_points (
    customer_id,
    points_earned,
    current_balance,
    order_id,
    transaction_type,
    description,
    expires_at
  ) VALUES (
    customer_uuid,
    points_to_add,
    current_points + points_to_add,
    order_uuid,
    'earned',
    'Points earned from order',
    now() + interval '1 year'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  user_uuid uuid,
  notification_title text,
  notification_message text,
  notification_type text,
  notification_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    data
  ) VALUES (
    user_uuid,
    notification_title,
    notification_message,
    notification_type,
    notification_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update customer analytics
CREATE OR REPLACE FUNCTION update_customer_analytics(customer_uuid uuid)
RETURNS void AS $$
DECLARE
  order_count integer;
  total_amount numeric;
  total_savings numeric;
  waste_kg numeric;
  avg_value numeric;
  last_order timestamptz;
  tier text;
BEGIN
  -- Calculate metrics
  SELECT 
    COUNT(*),
    COALESCE(SUM(total_amount), 0),
    COALESCE(SUM((p.original_price - o.unit_price) * o.quantity), 0),
    COALESCE(SUM(o.quantity * 0.5), 0), -- Assume 0.5kg per item
    COALESCE(AVG(total_amount), 0),
    MAX(o.created_at)
  INTO order_count, total_amount, total_savings, waste_kg, avg_value, last_order
  FROM orders o
  JOIN products p ON o.product_id = p.id
  WHERE o.customer_id = customer_uuid
    AND o.status = 'completed';

  -- Determine loyalty tier
  IF total_amount >= 5000 THEN
    tier := 'platinum';
  ELSIF total_amount >= 2000 THEN
    tier := 'gold';
  ELSIF total_amount >= 500 THEN
    tier := 'silver';
  ELSE
    tier := 'bronze';
  END IF;

  -- Update or insert analytics
  INSERT INTO customer_analytics (
    customer_id,
    total_orders,
    total_spent,
    total_saved,
    waste_prevented_kg,
    avg_order_value,
    last_order_date,
    loyalty_tier
  ) VALUES (
    customer_uuid,
    order_count,
    total_amount,
    total_savings,
    waste_kg,
    avg_value,
    last_order,
    tier
  )
  ON CONFLICT (customer_id) DO UPDATE SET
    total_orders = EXCLUDED.total_orders,
    total_spent = EXCLUDED.total_spent,
    total_saved = EXCLUDED.total_saved,
    waste_prevented_kg = EXCLUDED.waste_prevented_kg,
    avg_order_value = EXCLUDED.avg_order_value,
    last_order_date = EXCLUDED.last_order_date,
    loyalty_tier = EXCLUDED.loyalty_tier,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers to automatically update analytics
CREATE OR REPLACE FUNCTION trigger_update_customer_analytics()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.status = 'completed' THEN
      PERFORM update_customer_analytics(NEW.customer_id);
      PERFORM update_loyalty_points(NEW.customer_id, NEW.id, FLOOR(NEW.total_amount / 10)::integer);
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order completion
DROP TRIGGER IF EXISTS trigger_customer_analytics_on_order ON orders;
CREATE TRIGGER trigger_customer_analytics_on_order
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_customer_analytics();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_favorites_customer ON customer_favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant ON reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_balance ON loyalty_points(customer_id, current_balance);
CREATE INDEX IF NOT EXISTS idx_customer_analytics_tier ON customer_analytics(loyalty_tier);

-- Update triggers for updated_at columns
CREATE TRIGGER update_customer_addresses_updated_at
  BEFORE UPDATE ON customer_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_preferences_updated_at
  BEFORE UPDATE ON customer_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_analytics_updated_at
  BEFORE UPDATE ON customer_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();