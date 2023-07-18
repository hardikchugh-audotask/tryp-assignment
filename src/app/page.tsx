"use client";

import styles from "./page.module.css";
import { Flex, Box } from "@chakra-ui/react";
import DataTable from "./components/DataTable";
import { useState, useEffect, useMemo } from "react";
import Chip from "./components/Chip";

const API_ENDPOINT = "https://dummyjson.com/products?limit=100";

const headers = [
  {
    id: "brand",
    label: "Brand",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "discountPercentage",
    label: "Discount Percentage",
    isNumeric: true,
  },
  {
    id: "title",
    label: "Title",
  },
  {
    id: "rating",
    label: "Rating",
    isNumeric: true,
  },
  {
    id: "price",
    label: "Price",
    isNumeric: true,
  },
  {
    id: "select",
    label: "Select",
    sortable: false,
  },
];

type ProductProps = {
  brand: string;
  category: string;
  discountPercentage: number;
  title: string;
  rating: JSX.Element | number | null;
  price: number;
};

// return products from api in particular format
const getProducts = async () => {
  const data = await fetch(API_ENDPOINT);
  const { products } = await data.json();
  return (
    products.map(
      ({
        brand,
        category,
        discountPercentage,
        title,
        rating,
        price,
      }: ProductProps) => ({
        brand,
        category,
        discountPercentage,
        title,
        rating,
        price,
      })
    ) ?? []
  );
};

const chipColors = ["teal", "green", "yellow", "blue", "purple"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductProps[]>([]);
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch();
  }, []);

  const colsData = useMemo(() => {
    if (products?.length) {
      return products.map((product: ProductProps) => {
        const randomColor =
          chipColors[Math.floor(Math.random() * chipColors.length)];
        product["rating"] = (
          <Chip title={product?.rating} bgColor={randomColor} />
        );
        return product;
      });
    }
    return [];
  }, [products]);

  return (
    <main className={styles.main}>
      <Flex alignItems={"center"} py={"4"} flexDirection={"column"}>
        <h2>Custom Table Component</h2>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <Box maxWidth={"80%"}>
            <DataTable
              headers={headers}
              cols={colsData}
              caption={"User Information available here"}
            />
          </Box>
        )}
      </Flex>
    </main>
  );
}
