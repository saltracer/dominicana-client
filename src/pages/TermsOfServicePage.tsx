
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-garamond text-4xl md:text-5xl font-bold text-dominican-black mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-700">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black">
                Welcome to Dominicana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service ("Terms") govern your use of the Dominicana digital platform, 
                operated by the Order of Preachers to support prayer, study, community, and preaching. 
                By accessing or using our platform, you agree to be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                By accessing, browsing, or using Dominicana, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and our Privacy Policy. If you 
                do not agree to these Terms, please do not use our platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Purpose and Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Dominicana exists to serve the spiritual and intellectual needs of the Dominican family 
                and all those drawn to Dominican spirituality. Our platform provides resources for 
                prayer, study, community connection, and preaching in accordance with the charism 
                of St. Dominic and the tradition of the Order of Preachers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Account Creation</h4>
                <p className="text-gray-700 text-sm">
                  You may create an account to access additional features and personalize your experience. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Accurate Information</h4>
                <p className="text-gray-700 text-sm">
                  You agree to provide accurate, current, and complete information during registration 
                  and to update such information as necessary.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Account Security</h4>
                <p className="text-gray-700 text-sm">
                  You are responsible for all activities that occur under your account and must 
                  immediately notify us of any unauthorized use.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use Dominicana in a manner consistent with its spiritual purpose and mission. 
                Prohibited activities include:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Using the platform for any unlawful or harmful purpose</li>
                <li>• Attempting to interfere with or disrupt the platform's functionality</li>
                <li>• Posting or transmitting inappropriate, offensive, or harmful content</li>
                <li>• Violating the intellectual property rights of others</li>
                <li>• Impersonating others or providing false information</li>
                <li>• Using automated systems to access the platform without permission</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Platform Content</h4>
                <p className="text-gray-700 text-sm">
                  The content, design, and functionality of Dominicana are protected by copyright, 
                  trademark, and other intellectual property laws. Much of our content draws from 
                  the public domain works of Dominican saints and scholars.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">User-Generated Content</h4>
                <p className="text-gray-700 text-sm">
                  Any content you submit grants us a non-exclusive, royalty-free license to use, 
                  modify, and distribute such content in connection with our platform's mission.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Third-Party Content</h4>
                <p className="text-gray-700 text-sm">
                  We respect the intellectual property rights of others and expect users to do the same.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Subscription Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Some features may require a subscription. Subscription terms include:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Automatic renewal unless cancelled before the renewal date</li>
                <li>• No refunds for partial subscription periods</li>
                <li>• Price changes with 30 days advance notice</li>
                <li>• Cancellation may be done through your account settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference. 
                Please review our Privacy Policy to understand our practices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Service Availability</h4>
                <p className="text-gray-700 text-sm">
                  We strive to maintain continuous service but cannot guarantee uninterrupted access. 
                  The platform is provided "as is" without warranties of any kind.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Spiritual Guidance</h4>
                <p className="text-gray-700 text-sm">
                  While our platform provides spiritual resources, it does not replace personal 
                  spiritual direction, sacramental life, or professional counseling when needed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-dominican-black mb-2">Limitation of Liability</h4>
                <p className="text-gray-700 text-sm">
                  To the fullest extent permitted by law, we shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the platform at our discretion, 
                including for violations of these Terms. Upon termination, your right to use the 
                platform ceases immediately, though certain provisions of these Terms will survive termination.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of 
                significant changes by posting the updated Terms on this page and updating the 
                "Last updated" date. Your continued use after such changes constitutes acceptance 
                of the modified Terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Governing Law and Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by applicable law. Any disputes will be resolved through 
                good faith dialogue, reflecting the Dominican spirit of seeking truth and reconciliation. 
                If formal legal proceedings become necessary, they will be conducted in accordance 
                with the jurisdiction where the Order of Preachers is based.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="font-garamond text-xl text-dominican-black">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 text-dominican-black">
                <p><strong>Email:</strong> legal@dominicana.org</p>
                <p><strong>Subject:</strong> Terms of Service Inquiry</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
