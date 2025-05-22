import React from 'react';
import { LiturgyComponent } from '@/lib/types/liturgy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLiturgy } from '@/context/LiturgyContext';

interface ComponentRendererProps {
  type: LiturgyComponent['type'];
  component: LiturgyComponent | LiturgyComponent[];
}

// Helper to render content as HTML with paragraphs
const ContentRenderer = ({ content }: { content: any }) => {
  if (!content) return null;
  
  if (typeof content === 'string') {
    return <p dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </>
    );
  }
  
  if (typeof content === 'object') {
    // Handle content with verses or other structured formats
    return (
      <div>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className="mb-2">
            <p dangerouslySetInnerHTML={{ __html: value as string }} />
          </div>
        ))}
      </div>
    );
  }
  
  return <p>{String(content)}</p>;
};

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ type, component }) => {
  const { userPreferences, currentHour } = useLiturgy();
  
  // Handle array of components (options)
  if (Array.isArray(component)) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">{type.replace('_', ' ')}</h3>
        {component.map((item, index) => (
          <Card key={item.id} className="mb-4">
            <CardHeader>
              <CardTitle>{item.title || `Option ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <ComponentRenderer type={type} component={item} />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // No component data
  if (!component) {
    return null;
  }
  
  // Specific component types with custom rendering
  switch (type) {
    case 'invitatory':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Invitatory</h3>
          <div className="italic mb-2">{component.rubrics}</div>
          <ContentRenderer content={component.content} />
        </div>
      );
      
    case 'psalm':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Psalm {component.psalm_number}
          </h3>
          {component.antiphon && (
            <div className="mb-2 font-medium italic">
              Ant. {component.antiphon}
            </div>
          )}
          <ContentRenderer content={component.content} />
          {component.has_gloria && (
            <div className="mt-2 italic">
              Glory be to the Father, and to the Son, and to the Holy Spirit,<br />
              as it was in the beginning, is now, and ever shall be,<br />
              world without end. Amen.
            </div>
          )}
          {component.antiphon && (
            <div className="mt-2 font-medium italic">
              Ant. {component.antiphon}
            </div>
          )}
        </div>
      );
      
    case 'reading':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Reading</h3>
          {component.citation && (
            <div className="mb-1 font-medium">{component.citation}</div>
          )}
          <ContentRenderer content={component.content} />
        </div>
      );
      
    case 'gospel_canticle':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {currentHour === 'lauds' ? 'Canticle of Zechariah' : 'Canticle of Mary'}
          </h3>
          {component.antiphon && (
            <div className="mb-2 font-medium italic">
              Ant. {component.antiphon}
            </div>
          )}
          <ContentRenderer content={component.content} />
          {component.antiphon && (
            <div className="mt-2 font-medium italic">
              Ant. {component.antiphon}
            </div>
          )}
        </div>
      );
      
    case 'intercessions':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Intercessions</h3>
          <ContentRenderer content={component.content} />
        </div>
      );
      
    case 'concluding_prayer':
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Concluding Prayer</h3>
          <ContentRenderer content={component.content} />
        </div>
      );
      
    default:
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {component.title || type.replace('_', ' ')}
          </h3>
          {userPreferences?.display_options?.showRubrics && component.rubrics && (
            <div className="text-gray-600 italic mb-2">{component.rubrics}</div>
          )}
          <ContentRenderer content={component.content} />
        </div>
      );
  }
};

export default ComponentRenderer;
