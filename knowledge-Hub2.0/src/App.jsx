// src/App.jsx
import Layout from './components/Layout';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function App() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Welcome to KnowledgeHub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Your single-page knowledge website is now live with beautiful responsive navbar!
        </p>
        <Button label="Start Learning" icon="pi pi-arrow-right" size="large" />
      </div>

      <div className="grid mt-12">
        <div className="col-12 md:col-6 lg:col-4">
          <Card title="Explore Topics" className="h-full">
            <p>Browse hundreds of topics from science to philosophy.</p>
          </Card>
        </div>
        {/* Add more cards as needed */}
      </div>
    </Layout>
  );
}

export default App;