
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-garamond text-4xl md:text-5xl font-bold text-dominican-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black">
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Dominicana respects your privacy and is committed to protecting the personal information 
                you share with us. This Privacy Policy explains how we collect, use, and safeguard your 
                information when you use our digital platform dedicated to Dominican spirituality and resources.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Personal Information</h4>
                <p className="text-gray-700 text-sm">
                  When you create an account or contact us, we may collect your name, email address, 
                  and any information you voluntarily provide in forms or correspondence.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Usage Information</h4>
                <p className="text-gray-700 text-sm">
                  We collect information about how you interact with our platform, including pages visited, 
                  time spent on the site, and features used to improve our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Technical Information</h4>
                <p className="text-gray-700 text-sm">
                  We may collect technical information such as your IP address, browser type, 
                  device information, and operating system for security and functionality purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• To provide and maintain our digital platform and services</li>
                <li>• To personalize your experience with liturgical preferences and content</li>
                <li>• To communicate with you about updates, new features, and Dominican resources</li>
                <li>• To respond to your inquiries and provide customer support</li>
                <li>• To improve our platform based on user feedback and usage patterns</li>
                <li>• To ensure the security and proper functioning of our services</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                We may share information only in the following circumstances:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• With your explicit consent</li>
                <li>• To comply with legal obligations or protect our rights</li>
                <li>• With trusted service providers who assist in operating our platform (under strict confidentiality agreements)</li>
                <li>• In connection with a merger, acquisition, or sale of assets (with prior notice to users)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                However, no method of transmission over the internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Access and review your personal information</li>
                <li>• Correct inaccurate or incomplete information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt out of marketing communications</li>
                <li>• Data portability (receive your data in a structured format)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at privacy@dominicana.org
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, remember your 
                preferences, and analyze site usage. You can control cookie settings through your 
                browser, though some features may not function properly if cookies are disabled.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Our platform is not directed to children under 13. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have 
                collected such information, we will take steps to delete it promptly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                significant changes by posting the new policy on this page and updating the "Last updated" 
                date. Your continued use of our platform after such modifications constitutes acceptance 
                of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <div className="mt-4 text-dominican-black">
                <p><strong>Email:</strong> privacy@dominicana.org</p>
                <p><strong>Subject:</strong> Privacy Policy Inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
