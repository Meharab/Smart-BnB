import { ethers } from "hardhat";
import rentalList from "./sampleRentalList.json";

const LISTING_FEE = 0.0001;

async function main() {
  const Contract = await ethers.getContractFactory("SmartBnb");
  const contract = await Contract.deploy(
    ethers.utils.parseEther(LISTING_FEE.toFixed(18))
  );

  await contract.deployed();

  console.log("Deployed to:", contract.address);

  for (let rental of rentalList) {
    await contract.addRental(
      rental.name,
      rental.city,
      rental.lat,
      rental.long,
      rental.description,
      rental.imgUrl,
      rental.maxGuests,
      ethers.utils.parseEther(rental.pricePerDay.toString()),
      {
        value: ethers.utils.parseEther(LISTING_FEE.toString()),
      }
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
