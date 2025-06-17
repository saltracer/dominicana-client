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

export interface SecurityEvent {
  event: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
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
    
    // Store in browser storage for immediate access
    const existingLogs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    existingLogs.push(auditEntry);
    
    // Keep only last 100 entries to prevent storage bloat
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('admin_audit_logs', JSON.stringify(existingLogs));
    
    // In a production environment, this would be sent to a secure audit log service
    // For now, we're logging to console and localStorage for security monitoring
    
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

export const logSecurityEvent = async (
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const securityEvent: SecurityEvent = {
      event,
      severity,
      details,
      user_id: user?.id,
      timestamp: new Date().toISOString(),
      ip_address: 'unknown', // Would need server-side implementation
      user_agent: navigator.userAgent
    };

    // Different log levels based on severity
    if (severity === 'critical' || severity === 'high') {
      console.error('SECURITY EVENT:', securityEvent);
    } else if (severity === 'medium') {
      console.warn('Security Event:', securityEvent);
    } else {
      console.log('Security Event:', securityEvent);
    }
    
    // Store security events for analysis
    const existingEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
    existingEvents.push(securityEvent);
    
    // Keep only last 50 security events
    if (existingEvents.length > 50) {
      existingEvents.splice(0, existingEvents.length - 50);
    }
    
    localStorage.setItem('security_events', JSON.stringify(existingEvents));
    
    // In production, high severity events would trigger immediate alerts
    if (severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT - IMMEDIATE ATTENTION REQUIRED:', securityEvent);
      // Would trigger immediate notification to security team
    }
    
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    return JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
  } catch {
    return [];
  }
};

export const getSecurityEvents = (): SecurityEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('security_events') || '[]');
  } catch {
    return [];
  }
};

export const clearAuditLogs = () => {
  localStorage.removeItem('admin_audit_logs');
};

export const clearSecurityEvents = () => {
  localStorage.removeItem('security_events');
};

// Security monitoring utilities
export const monitorSuspiciousActivity = () => {
  const events = getSecurityEvents();
  const recentEvents = events.filter(event => {
    const eventTime = new Date(event.timestamp).getTime();
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return eventTime > oneHourAgo;
  });
  
  // Check for patterns that might indicate attacks
  const failedLogins = recentEvents.filter(e => e.event.includes('failed_signin'));
  const rateLimitHits = recentEvents.filter(e => e.event.includes('rate_limit'));
  const unauthorizedAttempts = recentEvents.filter(e => e.event.includes('unauthorized'));
  
  if (failedLogins.length > 5) {
    console.warn('High number of failed login attempts detected');
  }
  
  if (rateLimitHits.length > 3) {
    console.warn('Multiple rate limit violations detected');
  }
  
  if (unauthorizedAttempts.length > 2) {
    console.warn('Multiple unauthorized access attempts detected');
  }
  
  return {
    failedLogins: failedLogins.length,
    rateLimitHits: rateLimitHits.length,
    unauthorizedAttempts: unauthorizedAttempts.length,
    totalEvents: recentEvents.length
  };
};
