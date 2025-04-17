
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { TABLES } from './schema';

const SUPABASE_URL = "https://tiakuneprywurazjmtqy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYWt1bmVwcnl3dXJhemptdHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNzYxNjUsImV4cCI6MjA1OTk1MjE2NX0.KyPNAiN9vxJzLy06REtLZ47rw5gLUzigWFPTPqWF14A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add helper functions for common queries
export const getApprovedDrivers = async () => {
  // Query for both 'approved' and 'available' status to ensure we get all possible drivers
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .or('status.eq.approved,status.eq.available');
    
  if (error) throw error;
  return data;
};

export const getGpsEnabledTrucks = async () => {
  // Query for both 'available' and null assigned_driver_id to ensure we get all available trucks
  const { data, error } = await supabase
    .from('trucks')
    .select('*')
    .or('status.eq.available')
    .eq('gps_enabled', true)
    .is('assigned_driver_id', null);
    
  if (error) throw error;
  return data;
};

// Helper for formatting PostgreSQL point data
export const formatPointData = (lng: number, lat: number): string => {
  return `(${lng},${lat})`;
};

// Helper for parsing point data from Postgres to [number, number] array
export const parsePointData = (pointData: unknown): [number, number] | undefined => {
  if (!pointData) return undefined;
  
  // If it's already in the correct format, return it
  if (Array.isArray(pointData) && pointData.length === 2 && 
      typeof pointData[0] === 'number' && typeof pointData[1] === 'number') {
    return pointData as [number, number];
  }
  
  // Handle PostgreSQL point object with x, y properties
  if (pointData !== null && typeof pointData === 'object' && 'x' in pointData && 'y' in pointData) {
    const point = pointData as {x: string|number, y: string|number};
    const x = typeof point.x === 'string' ? parseFloat(point.x) : (typeof point.x === 'number' ? point.x : 0);
    const y = typeof point.y === 'string' ? parseFloat(point.y) : (typeof point.y === 'number' ? point.y : 0);
    return [x, y];
  }
  
  return undefined;
};

