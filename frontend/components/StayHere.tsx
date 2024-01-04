import { useNotification } from "@web3uikit/core";
import { Modal, Input, Text, Button } from "@nextui-org/react";
import { useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract } from "../assets/utils";
import { ethers } from "ethers";

function StayHere({ rental }) {
  const [isVisible, setVisible] = useState(false);
  const notify = useNotification();

  // TODO some useStates for dates
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

  const book = async () => {
    try {
      notify({
        id: "info",
        type: "info",
        title: "Trying to book...",
        position: "topL",
      });

      const startTimestamp = Math.ceil(startDate.getTime() / 1000);
      let endTimestamp = endDate.getTime() / 1000;
      const numDays = Math.ceil(
        (endTimestamp - startTimestamp) / (60 * 60 * 24)
      );
      endTimestamp = startTimestamp + numDays * (60 * 60 * 24);
      console.log(startTimestamp, endTimestamp, numDays);
      console.log(
        ethers.utils.parseEther(
          (Number(rental.pricePerDay) * numDays).toString()
        )
      );

      const smartBnbContract = getSmartBnbContract(signer, chain);

      const tx = await smartBnbContract.bookDates(
        rental.id,
        startTimestamp,
        endTimestamp,
        {
          value: ethers.utils.parseEther(
            (Number(rental.pricePerDay) * numDays).toString()
          ),
        }
      );
      await tx.wait();

      console.log("OK");
      notify({
        type: "success",
        message: `You are going to ${rental.city}!`,
        title: "Booking Succesful",
        position: "topL",
      });
    } catch (error) {
      console.log(error);
      notify({
        type: "error",
        message: `${error.reason}`,
        title: "Booking Failed",
        position: "topL",
      });
    }
  };

  return (
    <>
      {/* TODO add style */}

      <Button color="error" auto onClick={() => setVisible(true)}>
        Stay Here
      </Button>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={isVisible}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Choose dates
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            width="186px"
            label="Check In"
            type="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <Input
            width="186px"
            label="Check Out"
            type="date"
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" auto onPress={book}>
            Book
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StayHere;
