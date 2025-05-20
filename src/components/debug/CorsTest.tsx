
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CorsTestProps {
  url: string;
}

const CorsTest: React.FC<CorsTestProps> = ({ url }) => {
  const [status, setStatus] = useState<string>('Not tested');
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<string>('');

  const testCors = async () => {
    if (!url) {
      setStatus('No URL provided');
      return;
    }

    setLoading(true);
    setStatus('Testing...');
    setDetails('');

    try {
      console.log(`Testing CORS for URL: ${url}`);
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
      });

      console.log('CORS test response:', response);
      
      if (response.ok) {
        setStatus('✅ CORS allowed');
        
        // Get headers for more details
        const headers: string[] = [];
        response.headers.forEach((value, key) => {
          headers.push(`${key}: ${value}`);
        });
        
        setDetails(`Status: ${response.status} ${response.statusText}
Headers:
${headers.join('\n')}`);
      } else {
        setStatus(`❌ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('CORS test error:', error);
      setStatus('❌ CORS error');
      setDetails(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset status when URL changes
    setStatus('Not tested');
    setDetails('');
  }, [url]);

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="font-medium mb-2">CORS Diagnostics</h3>
      <p className="text-sm mb-2 break-all">URL: {url || 'No URL provided'}</p>
      
      <div className="flex items-center gap-2 mb-2">
        <Button 
          onClick={testCors} 
          disabled={loading || !url}
          size="sm"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Test CORS
        </Button>
        <span className={`text-sm ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
          {status}
        </span>
      </div>
      
      {details && (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
          {details}
        </pre>
      )}
    </div>
  );
};

export default CorsTest;
