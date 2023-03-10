import React, { useState } from "react";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

//INTERNAL IMPORT
import Style from "./Upload.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import images from "../img";
import { Button } from "../components/componentsindex.js";
import { DropZone } from "./uploadNFTIndex.js";

//import { createNftRequest } from "../api/nfts.js";

const UloadNFT = ({ uploadToIPFS, createNFT }) => {
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [category, setCategory] = useState(0);
  const [properties, setProperties] = useState("");
  const [image, setImage] = useState(null);
  const [summary, setSummary] = useState("Keine Zusammenfassung");
  const [maxGroupSize, setMaxGroupSize] = useState("8");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("7 Tagen");
  const router = useRouter();

  const createNftRequest = async (
    name,
    price,
    image,
    description,
    router,
    website,
    royalties,
    fileSize,
    category,
    properties,
    difficulty,
    duration,
    imageCover,
    maxGroupSize,
    ratingsAverage,
    summary
  ) => {
    let data = {};
    data.name = name;
    data.price = price;
    data.image = image;
    data.description = description;
    data.router = router;
    data.website = website;
    data.royalties = royalties;
    data.fileSize = fileSize;
    data.category = category;
    data.properties = properties;
    data.difficulty = difficulty;
    data.duration = duration;
    data.imageCover = imageCover;
    data.maxGroupSize = maxGroupSize;
    data.ratingsAverage = ratingsAverage;
    data.duration = duration;
    data.difficulty = difficulty;

    setDefaultDuration(duration);

    try {
      const response = await axios.post(
        "http://localhost:3033/api/v1/nfts",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.status);
      if (response.data.status === "Success") {
        // localStorage.setItem("token", response.data.token);

        router.push("/");
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log(error.response.data);
        for (let key in error.response.data) {
          console.log(error.response.data[key].message);
          // Show an error message to the user, indicating that the value is required
        }
      } else {
        console.error(error);
      }
    }
  };

  const categoryArry = [
    {
      image: images.nft_image_1,
      category: "Sports",
    },
    {
      image: images.nft_image_2,
      category: "Arts",
    },
    {
      image: images.nft_image_3,
      category: "Music",
    },
    {
      image: images.nft_image_1,
      category: "Digital",
    },
    {
      image: images.nft_image_2,
      category: "Time",
    },
    {
      image: images.nft_image_3,
      category: "Photography",
    },
  ];
  const handleClick = async () => {
    await createNftRequest(
      name,
      price,
      image,
      description,
      router,
      website,
      royalties,
      fileSize,
      category,
      properties,
      difficulty,
      duration
    );
    await createNFT(
      name,
      price,
      image,
      description,
      router,
      website,
      royalties,
      fileSize,
      category,
      properties,
      difficulty,
      duration
    );
  };
  const handleChange = (e) => {
    setDifficulty(e.target.value);
  };
  return (
    <div className={Style.upload}>
      <DropZone
        title="JPG, PNG, WEBM , MAX 100MB"
        heading="Drag & drop file"
        subHeading="or Browse media on your device"
        name={name}
        website={website}
        description={description}
        royalties={royalties}
        category={category}
        properties={properties}
        setImage={setImage}
        uploadToIPFS={uploadToIPFS}
        summary={summary}
        maxGroupSize={maxGroupSize}
        difficulty={difficulty}
        duration={duration}
      />

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="nft">Item Name</label>
          <input
            type="text"
            placeholder="shoaib bhai"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="website">Website</label>
          <div className={formStyle.Form_box_input_box}>
            <div className={formStyle.Form_box_input_box_icon}>
              <MdOutlineHttp />
            </div>

            <input
              type="text"
              placeholder="website"
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <p className={Style.upload_box_input_para}>
            Ciscrypt will include a link to this URL on this item's detail page,
            so that users can click to learn more about it. You are welcome to
            link to your own webpage with more details.
          </p>
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="something about yourself in few words"
            onChange={(e) => setDescription(e.target.value)}></textarea>
          <p>
            The description will be included on the item's detail page
            underneath its image. Markdown syntax is supported.
          </p>
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Choose collection</label>
          <p className={Style.upload_box_input_para}>
            Choose an exiting collection or create a new one
          </p>

          <div className={Style.upload_box_slider_div}>
            {categoryArry.map((el, i) => (
              <div
                className={`${Style.upload_box_slider} ${
                  active == i + 1 ? Style.active : ""
                }`}
                key={i + 1}
                onClick={() => (setActive(i + 1), setCategory(el.category))}>
                <div className={Style.upload_box_slider_box}>
                  <div className={Style.upload_box_slider_box_img}>
                    <Image
                      src={el.image}
                      alt="background image"
                      width={70}
                      height={70}
                      className={Style.upload_box_slider_box_img_img}
                    />
                  </div>
                  <div className={Style.upload_box_slider_box_img_icon}>
                    <TiTick />
                  </div>
                </div>
                <p>Crypto Legend - {el.category} </p>
              </div>
            ))}
          </div>
        </div>

        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Royalties">Royalties</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <FaPercent />
              </div>
              <input
                type="text"
                placeholder="20%"
                onChange={(e) => setRoyalties(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="size">Size</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <MdOutlineAttachFile />
              </div>
              <input
                type="number"
                placeholder="165MB"
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="Propertie">Propertie</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Propertie"
                onChange={(e) => setProperties(e.target.value)}
              />
            </div>
          </div>

          <div className={formStyle.Form_box_input_social}>
            <div className={formStyle.Form_box_input}>
              <div className={formStyle.Form_box_input_box}>
                <label htmlFor="Difficulty">Diffculty</label>
                <select
                  name="difficulty"
                  onChange={handleChange}
                  div
                  className={formStyle.Form_box_input_box_icon}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div className={formStyle.Form_box_input}>
            <label htmlFor="Price">Price</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="summary">Summary</label>
            <textarea
              name=""
              id=""
              cols="1"
              rows="7"
              placeholder="something about yourself in few words"
              onChange={(e) => setSummary(e.target.value)}></textarea>
            <p>
              Die Zusammenfassung wird auf der Detailseite des Artikels
              angezeigt Die Markdown-Syntax wird unterst??tzt.
            </p>
          </div>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="duration">Duration</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Duration"
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={Style.upload_box_btn}>
          <Button
            btnName="Upload"
            handleClick={handleClick}
            classStyle={Style.upload_box_btn_style}
          />
          <Button
            btnName="Preview"
            handleClick={() => {}}
            classStyle={Style.upload_box_btn_style}
          />
        </div>
      </div>
    </div>
  );
};

export default UloadNFT;
