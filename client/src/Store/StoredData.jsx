import axios from "axios";

// Categories Data
export const getCategoriesData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/admin/get/category');
    console.log("Fetched Categories:", response.data);  // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Vendors Data
export const getVendorsData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/admin/get/vendor-data');
    console.log("Fetched Categories:", response.data);  // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
