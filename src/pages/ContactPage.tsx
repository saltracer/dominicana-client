
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - this would typically send to a backend
    alert('Thank you for your message. We will respond as soon as possible.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-garamond text-4xl md:text-5xl font-bold text-dominican-black mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We welcome your questions, suggestions, and feedback as we continue to serve the Dominican family worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <MessageCircle className="mr-2" size={24} />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    required 
                    className="mt-1 min-h-[120px]" 
                    placeholder="Please share your thoughts, questions, or suggestions..."
                  />
                </div>
                <Button type="submit" className="w-full bg-dominican-black hover:bg-gray-800">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="font-garamond text-xl text-dominican-black flex items-center">
                  <Mail className="mr-2" size={20} />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">
                  For general inquiries about Dominicana:
                </p>
                <p className="text-dominican-black font-medium">
                  info@dominicana.org
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="font-garamond text-xl text-dominican-black flex items-center">
                  <Phone className="mr-2" size={20} />
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">
                  For technical issues or accessibility concerns:
                </p>
                <p className="text-dominican-black font-medium">
                  support@dominicana.org
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="font-garamond text-xl text-dominican-black flex items-center">
                  <MapPin className="mr-2" size={20} />
                  Order of Preachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">
                  Master of the Order:
                </p>
                <p className="text-dominican-black font-medium mb-2">
                  Casa Santa Sabina
                </p>
                <p className="text-gray-600 text-sm">
                  Aventino, Rome, Italy
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="font-garamond text-xl text-dominican-black">
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We strive to respond to all inquiries within 2-3 business days. 
                  For urgent matters, please indicate this in your subject line.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-amber-200 mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-garamond text-xl text-dominican-black mb-4">
                Join Our Community
              </h3>
              <p className="text-gray-700 mb-4">
                Follow us for updates on new resources, feast days, and Dominican spirituality.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="border-dominican-black text-dominican-black hover:bg-dominican-black hover:text-white">
                  Newsletter
                </Button>
                <Button variant="outline" className="border-dominican-black text-dominican-black hover:bg-dominican-black hover:text-white">
                  Social Media
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
