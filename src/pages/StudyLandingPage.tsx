import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, GraduationCap, Lightbulb, Users } from 'lucide-react';
const StudyLandingPage: React.FC = () => {
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-garamond text-5xl md:text-6xl font-bold text-dominican-black mb-6">
            Study
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            "Study is the foundation of preaching." Explore the rich intellectual tradition of the Dominican Order, 
            from the Summa Theologica to contemporary theological reflection.
          </p>
          <p className="text-lg text-gray-600 mt-4 italic">
            - St. Thomas Aquinas
          </p>
        </div>

        {/* Study Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <Book className="mr-3" size={28} />
                Digital Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Access a comprehensive collection of Dominican theological works, spiritual writings, 
                and philosophical treatises from the greatest minds of the Order.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-dominican-black rounded-full mr-3"></div>
                  <span>Works of St. Thomas Aquinas</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-dominican-black rounded-full mr-3"></div>
                  <span>Writings of St. Catherine of Siena</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-dominican-black rounded-full mr-3"></div>
                  <span>Modern Dominican Theology</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-dominican-black rounded-full mr-3"></div>
                  <span>Spiritual Classics Collection</span>
                </div>
              </div>
              <Link to="/study/library">
                <Button className="w-full bg-dominican-burgundy">
                  Browse Library
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-amber-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-garamond text-2xl text-dominican-black flex items-center">
                <GraduationCap className="mr-3" size={28} />
                Educational Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Deepen your understanding of Catholic doctrine, Dominican spirituality, 
                and theological principles through structured learning materials.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-amber-50 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black mb-1">Thomistic Philosophy</h4>
                  <p className="text-sm text-gray-600">Fundamental principles of Scholastic thought</p>
                </div>
                <div className="bg-amber-50 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black mb-1">Dominican Spirituality</h4>
                  <p className="text-sm text-gray-600">The charism of contemplation and preaching</p>
                </div>
                <div className="bg-amber-50 p-3 rounded">
                  <h4 className="font-semibold text-dominican-black mb-1">Sacred Scripture</h4>
                  <p className="text-sm text-gray-600">Biblical studies and exegesis</p>
                </div>
              </div>
              <Button disabled className="w-full bg-dominican-burgundy">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dominican Intellectual Tradition */}
        <Card className="border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-3xl text-dominican-black text-center">
              The Dominican Intellectual Tradition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Lightbulb className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Reason & Faith</h3>
                <p className="text-gray-700 text-sm">
                  The harmonious integration of philosophical reasoning with theological truth, 
                  following the method of St. Thomas Aquinas.
                </p>
              </div>
              <div className="text-center">
                <Book className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Sacred Study</h3>
                <p className="text-gray-700 text-sm">
                  Rigorous examination of Scripture, tradition, and doctrine as the foundation 
                  for effective preaching and teaching.
                </p>
              </div>
              <div className="text-center">
                <Users className="mx-auto mb-4 text-dominican-black" size={32} />
                <h3 className="font-garamond text-xl font-semibold mb-3">Scholarly Community</h3>
                <p className="text-gray-700 text-sm">
                  Learning in community through discussion, debate, and the sharing of insights 
                  among brothers and sisters in the Order.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Authors */}
        <Card className="border-amber-200 mb-8">
          <CardHeader>
            <CardTitle className="font-garamond text-2xl text-dominican-black text-center">
              Great Dominican Theologians
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black mb-2">St. Thomas Aquinas</h4>
                <p className="text-xs text-gray-600">Doctor Angelicus</p>
                <p className="text-xs text-gray-500 mt-1">Summa Theologica</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black mb-2">St. Catherine of Siena</h4>
                <p className="text-xs text-gray-600">Doctor of the Church</p>
                <p className="text-xs text-gray-500 mt-1">The Dialogue</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black mb-2">St. Albert the Great</h4>
                <p className="text-xs text-gray-600">Doctor Universalis</p>
                <p className="text-xs text-gray-500 mt-1">Natural Philosophy</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded">
                <h4 className="font-garamond font-semibold text-dominican-black mb-2">Master Eckhart</h4>
                <p className="text-xs text-gray-600">Mystic & Theologian</p>
                <p className="text-xs text-gray-500 mt-1">Spiritual Sermons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-100">
          <CardContent className="text-center py-8">
            <blockquote className="text-xl text-gray-800 italic font-medium mb-4">
              "The study of truth is the highest form of human activity."
            </blockquote>
            <p className="text-gray-600">- St. Thomas Aquinas</p>
            <p className="text-sm text-gray-500 mt-2">Doctor Angelicus</p>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default StudyLandingPage;