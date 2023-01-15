import axios from "axios";

// export const createNftRequest = async (data) => {
//  data.price = price;
//  data.image = image;
//  data.description = description;
//  data.router = router;
//  data.website = website;
//  data.royalties = royalties;
//  data.fileSize = fileSize;
//  data.category = category;
//  data.properties = properties;
//   return await axios.post("http://localhost:3033/api/v1/nfts", data, {
//     headers: {
//       "Content-Type": "multipart/form-data"
//     },
//   });
// };

// export const createNftRequest = async (data) => {
//   const form = new FormData();
//   for (let key in data) {
//     form.append(key, data[key]);
//   }
//   return await axios.post("http://localhost:3033/api/v1/nfts", form, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
  

// export const createNftRequest = async (
//   name,
//   price,
//   image,
//   description,
//   router,
//   website,
//   royalties,
//   fileSize,
//   category,
//   properties
// ) => {
//   let data = {};
//   data.name = name;
//   data.price = price;
//   data.image = image;
//   data.description = description;
//   data.router = router;
//   data.website = website;
//   data.royalties = royalties;
//   data.fileSize = fileSize;
//   data.category = category;
//   data.properties = properties;
//   try {
//     const response = await axios.post(
//       "http://localhost:3033/api/v1/nfts",
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     console.log(response.data.status);
//     if (response.data.status === "Success") {
//       // localStorage.setItem("token", response.data.token);

//       router.push("/");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
