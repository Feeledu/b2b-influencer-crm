import Layout from "@/components/Layout";

const CRMWorkspaceTest = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Workspace Test</h1>
          <p className="text-gray-600 mt-1">This is a test page to check if the route works</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>If you can see this, the CRM workspace route is working!</p>
        </div>
      </div>
    </Layout>
  );
};

export default CRMWorkspaceTest;
