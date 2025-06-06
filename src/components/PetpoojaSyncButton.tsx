
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PetpoojaSyncButtonProps {
  restaurantId: string;
  syncType?: 'menu' | 'orders';
  onSyncComplete?: () => void;
  petpoojaData?: any; // For development, we can pass the JSON data directly
}

const PetpoojaSyncButton = ({ 
  restaurantId, 
  syncType = 'menu',
  onSyncComplete,
  petpoojaData 
}: PetpoojaSyncButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Development data - using the provided JSON response
  const developmentData = {
    "success": "1",
    "restaurants": [
      {
        "restaurantid": "ydmpfabg",
        "active": "1",
        "details": {
          "menusharingcode": "122423",
          "currency_html": "₹",
          "country": "India",
          "images": [],
          "restaurantname": "Heaven",
          "address": "nearsargasan,sghighway,Gandhinagar",
          "contact": "9998696995",
          "latitude": "23.190394",
          "longitude": "72.610591",
          "landmark": "",
          "city3": "Ahmedabad",
          "state": "Gujarat",
          "minimumorderamount": "0",
          "minimumdeliverytime": "60Minutes",
          "minimum_prep_time": "30",
          "deliverycharge": "50",
          "deliveryhoursfrom1": "",
          "deliveryhoursto1": "",
          "deliveryhoursfrom2": "",
          "deliveryhoursto2": "",
          "sc_applicable_on": "H,P,D",
          "sc_type": "2",
          "sc_calculate_on": "2",
          "sc_value": "5",
          "tax_on_sc": "1",
          "calculatetaxonpacking": 1,
          "pc_taxes_id": "11213,20375",
          "calculatetaxondelivery": 1,
          "dc_taxes_id": "11213,20375",
          "packaging_applicable_on": "ORDER",
          "packaging_charge": "20",
          "packaging_charge_type": ""
        }
      }
    ],
    "ordertypes": [
      {
        "ordertypeid": 1,
        "ordertype": "Delivery"
      },
      {
        "ordertypeid": 2,
        "ordertype": "PickUp"
      },
      {
        "ordertypeid": 3,
        "ordertype": "DineIn"
      }
    ],
    "categories": [
      {
        "categoryid": "500773",
        "active": "1",
        "categoryrank": "16",
        "parent_category_id": "0",
        "categoryname": "Pizzaandsides",
        "categorytimings": "",
        "category_image_url": ""
      },
      {
        "categoryid": "500774",
        "active": "1",
        "categoryrank": "17",
        "parent_category_id": "0",
        "categoryname": "Cakes",
        "categorytimings": "",
        "category_image_url": ""
      }
    ],
    "parentcategories": [],
    "items": [
      {
        "itemid": "118829149",
        "itemallowvariation": "0",
        "itemrank": "52",
        "item_categoryid": "500773",
        "item_ordertype": "1,2,3",
        "item_tags": ["vegan", "new", "chef-special"],
        "item_packingcharges": "",
        "itemallowaddon": "1",
        "itemaddonbasedon": "0",
        "item_favorite": "0",
        "ignore_taxes": "0",
        "ignore_discounts": "0",
        "in_stock": "2",
        "variation_groupname": "",
        "variation": [],
        "addon": [
          {
            "addon_group_id": "135699",
            "addon_item_selection_min": "0",
            "addon_item_selection_max": "1"
          },
          {
            "addon_group_id": "135707",
            "addon_item_selection_min": "0",
            "addon_item_selection_max": "4"
          }
        ],
        "itemname": "Veg Loaded Pizza",
        "item_attributeid": "1",
        "itemdescription": "",
        "minimumpreparationtime": "",
        "price": "100",
        "active": "1",
        "item_image_url": "",
        "item_tax": "11213,20375",
        "nutrition": {
          "foodAmount": { "amount": 1, "unit": "g" },
          "calories": { "amount": 1, "unit": "kcal" },
          "protien": { "amount": 1, "unit": "g" },
          "minerals": [{ "name": "Sample", "amount": 1, "unit": "g" }],
          "sodium": { "amount": 1, "unit": "mg" },
          "carbohydrate": { "amount": 1, "unit": "g" },
          "totalSugar": { "amount": 1, "unit": "g" },
          "addedSugar": { "amount": 1, "unit": "g" },
          "totalFat": { "amount": 1, "unit": "g" },
          "saturatedFat": { "amount": 1, "unit": "g" },
          "transFat": { "amount": 1, "unit": "g" },
          "cholesterol": { "amount": 1, "unit": "g" },
          "vitamins": [{ "name": "a", "amount": 1, "unit": "g" }],
          "additionalInfo": { "info": "dsfsdf", "remark": "dsfdsfds" },
          "fiber": { "amount": 1, "unit": "g" },
          "servingInfo": "1to2people",
          "additiveMap": { "Polyols": { "amount": 1, "unit": "g" } },
          "allergens": [{ "allergen": "gluten", "allergenDesc": "dfsdfds" }]
        }
      },
      {
        "itemid": "118807411",
        "itemallowvariation": "0",
        "itemrank": "53",
        "item_categoryid": "500774",
        "item_ordertype": "1,2,3",
        "item_tags": [],
        "item_packingcharges": "",
        "itemallowaddon": "0",
        "itemaddonbasedon": "0",
        "item_favorite": "0",
        "ignore_taxes": "0",
        "ignore_discounts": "0",
        "in_stock": "2",
        "variation_groupname": "",
        "variation": [],
        "addon": [],
        "itemname": "Chocolate cake",
        "item_attributeid": "1",
        "itemdescription": "",
        "minimumpreparationtime": "",
        "price": "310",
        "active": "1",
        "item_image_url": "",
        "item_tax": "21866,21867",
        "nutrition": {
          "sodium": { "amount": 1, "unit": "Mg" },
          "carbohydrate": { "amount": 1, "unit": "G" },
          "totalSugar": { "amount": 1, "unit": "G" },
          "addedSugar": { "amount": 1, "unit": "G" },
          "cholesterol": { "amount": 1, "unit": "G" },
          "vitamins": [{ "name": "a", "amount": 1, "unit": "G" }],
          "additionalInfo": { "info": "dsfsdf", "remark": "dsfdsfds" },
          "fiber": { "amount": 1, "unit": "G" },
          "servingInfo": "1to2people"
        }
      },
      {
        "itemid": "7765809",
        "itemallowvariation": "0",
        "itemrank": "52",
        "item_categoryid": "500773",
        "item_ordertype": "1,2,3",
        "item_tags": [],
        "item_packingcharges": "",
        "itemallowaddon": "0",
        "itemaddonbasedon": "0",
        "item_favorite": "0",
        "ignore_taxes": "0",
        "ignore_discounts": "0",
        "in_stock": "2",
        "variation_groupname": "",
        "variation": [
          {
            "id": "7765862",
            "variationid": "89058",
            "name": "3Pieces",
            "groupname": "Quantity",
            "price": "140",
            "active": "1",
            "item_packingcharges": "20",
            "variationrank": "1",
            "addon": [],
            "variationallowaddon": 0
          },
          {
            "id": "7765097",
            "variationid": "89059",
            "name": "6Pieces",
            "groupname": "Quantity",
            "price": "160",
            "active": "1",
            "item_packingcharges": "20",
            "variationrank": "3",
            "addon": [],
            "variationallowaddon": 0
          }
        ],
        "addon": [],
        "itemname": "Garlic Bread",
        "item_attributeid": "1",
        "itemdescription": "",
        "minimumpreparationtime": "",
        "price": "140",
        "active": "1",
        "item_image_url": "",
        "item_tax": "11213,20375",
        "nutrition": {}
      }
    ],
    "variations": [
      {
        "variationid": "104220",
        "name": "Large",
        "groupname": "Quantity",
        "status": "1"
      },
      {
        "variationid": "104221",
        "name": "Small",
        "groupname": "Quantity",
        "status": "1"
      },
      {
        "variationid": "89058",
        "name": "3Pieces",
        "groupname": "Quantity",
        "status": "1"
      },
      {
        "variationid": "89059",
        "name": "6Pieces",
        "groupname": "Quantity",
        "status": "1"
      }
    ],
    "addongroups": [
      {
        "addongroupid": "135699",
        "addongroup_rank": "3",
        "active": "1",
        "addongroupitems": [
          {
            "addonitemid": "1150783",
            "addonitem_name": "Mojito",
            "addonitem_price": "0",
            "active": "1",
            "attributes": "1",
            "addonitem_rank": "1"
          },
          {
            "addonitemid": "1150784",
            "addonitem_name": "Hazelnut Mocha",
            "addonitem_price": "10",
            "active": "1",
            "attributes": "1",
            "addonitem_rank": "1"
          }
        ],
        "addongroup_name": "Add Beverage"
      },
      {
        "addongroupid": "135707",
        "addongroup_rank": "15",
        "active": "1",
        "addongroupitems": [
          {
            "addonitemid": "1150810",
            "addonitem_name": "Egg",
            "addonitem_price": "20",
            "active": "1",
            "attributes": "24",
            "addonitem_rank": "1"
          },
          {
            "addonitemid": "1150811",
            "addonitem_name": "Jalapenos",
            "addonitem_price": "20",
            "active": "1",
            "attributes": "1",
            "addonitem_rank": "1"
          },
          {
            "addonitemid": "1150812",
            "addonitem_name": "Onion Rings",
            "addonitem_price": "20",
            "active": "1",
            "attributes": "1",
            "addonitem_rank": "1"
          },
          {
            "addonitemid": "1150813",
            "addonitem_name": "Cheese",
            "addonitem_price": "10",
            "active": "1",
            "attributes": "1",
            "addonitem_rank": "1"
          }
        ],
        "addongroup_name": "Extra Toppings"
      }
    ],
    "attributes": [
      {
        "attributeid": "1",
        "attribute": "veg",
        "active": "1"
      },
      {
        "attributeid": "2",
        "attribute": "non-veg",
        "active": "1"
      },
      {
        "attributeid": "24",
        "attribute": "egg",
        "active": "1"
      }
    ],
    "discounts": [
      {
        "discountid": "363",
        "discountname": "Introductory Off",
        "discounttype": "1",
        "discount": "10",
        "discountordertype": "1,2,3",
        "discountapplicableon": "Items",
        "discountdays": "All",
        "active": "1",
        "discountontotal": "0",
        "discountstarts": "",
        "discountends": "",
        "discounttimefrom": "",
        "discounttimeto": "",
        "discountminamount": "",
        "discountmaxamount": "",
        "discounthascoupon": "0",
        "discountcategoryitemids": "7765809,7765862,7765097,118807411",
        "discountmaxlimit": ""
      }
    ],
    "taxes": [
      {
        "taxid": "11213",
        "taxname": "CGST",
        "tax": "2.5",
        "taxtype": "1",
        "tax_ordertype": "1,2,3",
        "active": "1",
        "tax_coreortotal": "2",
        "tax_taxtype": "1",
        "rank": "1",
        "consider_in_core_amount": "0",
        "description": ""
      },
      {
        "taxid": "20375",
        "taxname": "SGST",
        "tax": "2.5",
        "taxtype": "1",
        "tax_ordertype": "1,2,3",
        "active": "1",
        "tax_coreortotal": "2",
        "tax_taxtype": "1",
        "rank": "2",
        "consider_in_core_amount": "0",
        "description": ""
      },
      {
        "taxid": "21866",
        "taxname": "CGST",
        "tax": "9",
        "taxtype": "1",
        "tax_ordertype": "1",
        "active": "1",
        "tax_coreortotal": "2",
        "tax_taxtype": "1",
        "rank": "5",
        "consider_in_core_amount": "0",
        "description": ""
      },
      {
        "taxid": "21867",
        "taxname": "SGST",
        "tax": "9",
        "taxtype": "1",
        "tax_ordertype": "1",
        "active": "1",
        "tax_coreortotal": "2",
        "tax_taxtype": "1",
        "rank": "6",
        "consider_in_core_amount": "0",
        "description": ""
      }
    ],
    "serverdatetime": "2022-01-1811:33:13",
    "db_version": "1.0",
    "application_version": "4.0",
    "http_code": 200
  };

  const handleSync = async () => {
    setIsLoading(true);
    
    try {
      let responseData;

      if (syncType === 'menu') {
        // Use the new petpooja-menu-fetch function for menu sync
        const { data, error } = await supabase.functions.invoke('petpooja-menu-fetch', {
          body: {
            petpoojaData: petpoojaData || developmentData
          }
        });

        if (error) {
          throw error;
        }

        responseData = data;
      } else {
        // Use the existing petpooja-sync function for order sync
        const { data, error } = await supabase.functions.invoke('petpooja-sync', {
          body: {
            restaurant_id: restaurantId,
            sync_type: syncType
          }
        });

        if (error) {
          throw error;
        }

        responseData = data;
      }

      toast({
        title: "Sync Successful",
        description: syncType === 'menu' 
          ? `Menu data synced: ${responseData.processed?.restaurants || 0} restaurants, ${responseData.processed?.categories || 0} categories, ${responseData.processed?.items || 0} items`
          : `${syncType} sync completed successfully`,
        duration: 5000,
      });

      if (onSyncComplete) {
        onSyncComplete();
      }

    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || `Failed to sync ${syncType}`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {isLoading ? `Syncing ${syncType}...` : `Sync ${syncType}`}
    </Button>
  );
};

export default PetpoojaSyncButton;
