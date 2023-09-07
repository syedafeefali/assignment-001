import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {  useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  Box,
  Tabs,
  LegacyCard,
  Key,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // const { session  } = await authenticate.admin(request);

  const {admin, session} = await authenticate.admin(request);
  const data = await admin.rest.resources.Product.count({session});
  
 const theme = await admin.rest.resources.Theme.all({
    session: session,
    role:"main"
  });
  const theme_id = theme?.data[0]?.id;
  const assets = await admin.rest.resources.Asset.all({
    session: session,
    theme_id: theme_id,
  });

  const home_templates = assets.data.filter(item => /^templates\/index.*\.json$/.test(item.key));
  const product_templates = assets.data.filter(item => /^templates\/product.*\.json$/.test(item.key));
  const collection_templates = assets.data.filter(item => /^templates\/collection.*\.json$/.test(item.key));

// console.log(data);
  const shop = session.shop
  const apiAccessToken = session.accessToken;
  // TODO: Complete this function to fetch the assets from the Shopify API
  // and return the home, product, and collection templates.


  return json({ data: {home:home_templates,product:product_templates,collection:collection_templates} });
};

export let action = async ({request}) => {
  const { admin,session  } = await authenticate.admin(request);

  const shop = session.shop
  const apiAccessToken = session.accessToken;
  // TODO: Complete this function to duplicate the selected asset
  // by creating a new asset with a random key and the same content.
  // format should be if homepage then index.{random10-characters-key}.liquid, collection then collection.{random10-characters-key}.liquid, product then product.{random10-characters-key}.liquid

  const form = await request.formData();
  const key = form.get('key');
  const theme_id = form.get('theme_id');

  const time_rand = Date.now();

  let match =  key.match(/\/(index|product|collection)\./);
  match =  match? match[1]:"index";
  let success = false;

  try{
  const asset = new admin.rest.resources.Asset({session: session});
  asset.theme_id = theme_id;
  asset.key = "templates/"+match+"."+time_rand+".json";
  asset.source_key = key;
  const data = await asset.save({
    update: true,
  });
  success = true;
}catch(error){
  success = false;
}
  return json({success});
};

export default function Index() {
  const { data } = useLoaderData();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const submit = useSubmit();


  const handleSelect = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDuplicate = async () => {
    // TODO: Complete this function to submit the form with the selected asset key and theme ID.
    
    submit(selectedAsset, { replace: true, method: "POST" });
 
  };

  const RenderCard = ({asset}) => {
    // TODO: Complete this function to render a card for each asset with its key, theme ID, and updated at time.
   
    return (
    <>
        {asset.map((item, index) => (
          <div key={index} style={{cursor:"pointer",border:selectedAsset?.key == item.key?"1px solid":"0px"}} onClick={()=>{setSelectedAsset(item)}} >
          <LegacyCard.Section >
            <p>Key: {item.key}</p>
            <p>Updated At: {item.updated_at}</p>
            <p>Theme ID: {item.theme_id}</p>
          </LegacyCard.Section>
          </div>
        ))}
      </>
    );
  };

  // TODO: Create the Tabs and Panels components and render the assets inside the Panels.

  const tabs = Object.keys(data).map((content,index) => ({ content:content+" Pages",id:content }));






  return (
    <Page>
      <ui-title-bar title="Remix app template"></ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {/* TODO: Render the Tabs and Panels components here */}

            <LegacyCard>
            <Tabs tabs={tabs} selected={selectedTabIndex} onSelect={(state)=>{setSelectedTabIndex(state)}}>
        
            {(() => {

            switch (selectedTabIndex) {
              case 0:
                return <RenderCard  asset={data.home} />
                break;
              case 1:
                return <RenderCard  asset={data.product} />
                break;
              case 2:
                return <RenderCard  asset={data.collection} />
                break;   
            
            }})()}
      
            </Tabs>
          </LegacyCard>
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
