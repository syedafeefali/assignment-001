import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session  } = await authenticate.admin(request);

  const shop = session.shop
  const apiAccessToken = session.accessToken;
  // TODO: Complete this function to fetch the assets from the Shopify API
  // and return the home, product, and collection templates.

  return json({ data: {} });
};

export let action = async ({request}) => {
  const { session  } = await authenticate.admin(request);

  const shop = session.shop
  const apiAccessToken = session.accessToken;
  // TODO: Complete this function to duplicate the selected asset
  // by creating a new asset with a random key and the same content.
  // format should be if homepage then index.{random10-characters-key}.liquid, collection then collection.{random10-characters-key}.liquid, product then product.{random10-characters-key}.liquid

  return json({status: 'success'});
};

export default function Index() {
  const { data } = useLoaderData();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const submit = useSubmit();

  const handleSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDuplicate = () => {
    // TODO: Complete this function to submit the form with the selected asset key and theme ID.
  };

  const renderCard = (asset) => {
    // TODO: Complete this function to render a card for each asset with its key, theme ID, and updated at time.
  };

  // TODO: Create the Tabs and Panels components and render the assets inside the Panels.

  return (
    <Page>
      <ui-title-bar title="Remix app template"></ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {/* TODO: Render the Tabs and Panels components here */}
          </Layout.Section>
        </Layout>
        <form method="post">
          <input type="hidden" name="selectedAssetKey" value={selectedAsset ? selectedAsset.key : ''} />
          <input type="hidden" name="selectedAssetThemeId" value={selectedAsset ? selectedAsset.theme_id : ''} />
          <Button
            primary
            disabled={!selectedAsset}
            onClick={handleDuplicate}
          >
            Duplicate Template
          </Button>
        </form>
      </VerticalStack>
    </Page>
  );
  
}
