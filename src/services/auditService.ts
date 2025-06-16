
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  action: string;
  resource: string;
  resource_id?: string;
  details?: Record<string, any>;
  user_id?: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export const logAdminAction = async (
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Attempted to log admin action without authenticated user');
      return;
    }

    const auditEntry: AuditLogEntry = {
      action,
      resource,
      resource_id: resourceId,
      details,
      user_id: user.id,
      timestamp: new Date().toISOString(),
      ip_address: 'unknown', // Would need server-side implementation for real IP
      user_agent: navigator.userAgent
    };

    console.log('Admin Action Audit Log:', auditEntry);
    
    // In a production environment, this would be sent to a secure audit log service
    // For now, we're logging to console for security monitoring
    
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

export const logSecurityEvent = async (
  event: string,
  severity: 'low' | 'medium' | 'high',
  details?: Record<string, any>
) => {
  try {
    const securityEvent = {
      event,
      severity,
      details,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    };

    console.warn('Security Event:', securityEvent);
    
    // In production, this would trigger alerts for high severity events
    if (severity === 'high') {
      console.error('HIGH SEVERITY SECURITY EVENT:', securityEvent);
    }
    
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
