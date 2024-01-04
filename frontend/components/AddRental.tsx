import { useNotification } from "@web3uikit/core";
import { Modal, Input, Text, Button, Card } from "@nextui-org/react";
import { useState } from "react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract, LISTING_FEE } from "../assets/utils";
import { ethers } from "ethers";

function AddRental() {
  const [isVisible, setVisible] = useState(false);
  const notify = useNotification();

  const storage = new ThirdwebStorage();

  const [formInput, setFormInput] = useState({
    name: "",
    city: "",
    lat: "",
    long: "",
    description: "",
    imgUrl: null,
    maxGuests: 0,
    pricePerDay: 0,
  });

  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

  const addRental = async () => {
    console.log(formInput);

    try {
      notify({
        id: "info",
        type: "info",
        title: "Trying to add...",
        position: "topL",
      });
      const uploadUrl = await storage.upload(formInput.imgUrl, {
        uploadWithoutDirectory: true,
      });
      console.log(uploadUrl);
      const cid = uploadUrl.slice(7); // remove "ipfs://"

      const smartBnbContract = getSmartBnbContract(signer, chain);

      const tx = await smartBnbContract.addRental(
        formInput.name,
        formInput.city,
        formInput.lat,
        formInput.long,
        formInput.description,
        cid,
        formInput.maxGuests,
        ethers.utils.parseEther(formInput.pricePerDay.toString()),
        {
          value: ethers.utils.parseEther(LISTING_FEE.toString()),
        }
      );
      await tx.wait();
      console.log("OK");
      notify({
        type: "success",
        title: "Succesfully added",
        position: "topL",
      });
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `${error.reason}`,
        title: "Failed to add rental",
        position: "topL",
      });
    }
  };

  return (
    <>
      <Button
        color="error"
        auto
        size="lg"
        ghost
        onPress={() => setVisible(true)}
        css={{ position: "fixed", right: "20px", bottom: "20px" }}
      >
        Add rental
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isVisible}
        width="700px"
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Add Your Rental
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            placeholder="Enter rental title"
            label="Property name"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <Input
            placeholder="Enter your property city"
            label="Property city"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({ ...formInput, city: e.target.value })
            }
          />
          <Input
            placeholder="Enter latitude"
            label="Property Latitude"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({ ...formInput, lat: e.target.value })
            }
          />
          <Input
            placeholder="Enter longitude"
            label="Property Longitude"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({ ...formInput, long: e.target.value })
            }
          />
          <Input
            placeholder="Enter a description of the place"
            label="Property Description"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({ ...formInput, description: e.target.value })
            }
          />
          <Input
            placeholder="Enter maximum number of guest"
            label="Max number of guests"
            type="number"
            fullWidth
            // validation={{ numberMin: 1 }}
            onChange={(e) =>
              setFormInput({ ...formInput, maxGuests: Number(e.target.value) })
            }
          />
          <Input
            placeholder="Enter rent price per day"
            label="Price per day"
            type="text"
            fullWidth
            onChange={(e) =>
              setFormInput({
                ...formInput,
                pricePerDay: Number(e.target.value),
              })
            }
          />
          <Input
            label="Photo"
            type="file"
            fullWidth
            onChange={(e) =>
              setFormInput({
                ...formInput,
                imgUrl: (e.target as HTMLInputElement).files[0],
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" auto onPress={addRental}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddRental;
