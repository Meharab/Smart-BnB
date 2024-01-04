import { useEffect, useState } from "react";
import { useNetwork, useSigner } from "wagmi";
import { getSmartBnbContract } from "../assets/utils";
import StayHere from "./StayHere";
import { Card, Col, Grid, Row, Text } from "@nextui-org/react";
import { ethers } from "ethers";

function Rentals() {
  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork();

  type Rental = {
    id: Number;
    name: string;
    city: string;
    lat: string;
    long: string;
    description: string;
    imgUrl: string;
    maxGuests: Number;
    pricePerDay: Number;
  };

  const [rentalsList, setRentalsList] = useState<Rental[]>([]);

  useEffect(() => {
    async function getRentals() {
      // TODO get rentals from the contract
      try {
        const smartBnbContract = getSmartBnbContract(signer, chain);
        const rentalsData = await smartBnbContract.getRentals();
        console.log("Rentals");
        console.log(rentalsData);

        const rentals = rentalsData.map((rental, index) => ({
          id: rental.id.toNumber(),
          name: rental.name,
          city: rental.city,
          lat: rental.lat,
          long: rental.long,
          description: rental.description,
          imgUrl: rental.imgUrl,
          maxGuests: rental.maxGuests.toNumber(),
          pricePerDay: ethers.utils.formatEther(rental.pricePerDay),
        }));
        console.log(rentals);
        setRentalsList(rentals);
      } catch (error) {
        console.error(error);
      }

      // const rentals = [
      //   {
      //     id: 0,
      //     name: "Apartment in China Town",
      //     city: "New York",
      //     lat: "40.716862",
      //     long: "-73.999005",
      //     description: "2 Beds • 2 Rooms • Wifi • Kitchen • Living Area",
      //     imgUrl: "QmYJ5gudjXz9kfbicexS4H7GVvY1ZGAWRUCaqS8sGawjo2",
      //     maxGuests: 3,
      //     pricePerDay: 0.001,
      //   },
      //   {
      //     id: 1,
      //     name: "Luxury Suite in Victorian House",
      //     city: "London",
      //     lat: "51.53568",
      //     long: "-0.20565",
      //     description: "1 Beds • 1 Rooms • Bathtub • Wifi",
      //     imgUrl: "Qmek4kfSzwX2iX9BkswMo2HHLwbQxZbdBTerbF9FSQPJzJ",
      //     maxGuests: 2,
      //     pricePerDay: 0.015,
      //   },
      // ];
      // console.log(rentals);

      // setRentalsList(rentals);
    }

    getRentals();
  }, [signer, chain]);

  return (
    <>
      <Grid.Container gap={2} justify="flex-start">
        {rentalsList &&
          rentalsList.map((rental, i) => {
            return (
              <>
                {/* TODO build a card from the data*/}
                <Grid xs={6} sm={3} key={i}>
                  <Card css={{ mw: "400px" }}>
                    <Card.Header>
                      <Col>
                        <Text b>{rental.name}</Text>
                        <br />
                        <Text b>{rental.city}</Text>
                        <br />
                        <Text b>{rental.description}</Text>
                      </Col>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body>
                      <Card.Image
                        src={`https://ipfs.io/ipfs/${rental.imgUrl}`}
                        objectFit="cover"
                        width="100%"
                        height={140}
                        alt={rental.name}
                      />
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer css={{ justifyItems: "flex-start" }}>
                      <Row wrap="wrap" justify="space-between" align="center">
                        <Text
                          css={{
                            color: "$accents7",
                            fontWeight: "$semibold",
                            fontSize: "$sm",
                          }}
                        >
                          Maximum Guest: {rental.maxGuests.toString()}
                        </Text>
                        <Text
                          css={{
                            color: "$accents7",
                            fontWeight: "$semibold",
                            fontSize: "$sm",
                          }}
                        >
                          Price: {rental.pricePerDay.toString()}
                        </Text>
                      </Row>
                      <Row></Row>
                      <StayHere rental={rental} />
                    </Card.Footer>
                  </Card>
                </Grid>
              </>
            );
          })}
      </Grid.Container>
    </>
  );
}

export default Rentals;
