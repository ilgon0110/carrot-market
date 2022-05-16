import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="flex px-4 flex-col space-y-5 py-10">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Sold;
