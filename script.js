const networkInput = document.getElementById("network");
const amountInput = document.getElementById("amount");
const generateButton = document.getElementById("generate");
const codeInput = document.getElementById("code");
const saveButton = document.getElementById("save");
const pinInput = document.getElementById("pin");
const rechargeButton = document.getElementById("recharge");
const tableBody = document.getElementById("tableBody");
const tooltip = document.getElementById("tooltip");

if (!localStorage.getItem("recharges")) {
  localStorage.setItem("recharges", "[]");
}

const displayCodes = () => {
  const newRecharges = JSON.parse(localStorage.getItem("recharges"));

  for (let index = 0; index < newRecharges.length; index++) {
    const recharge = newRecharges[index];

    tableBody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${recharge.network}</td>
      <td>₦${recharge.amount}</td>
      <td>*311*${recharge.code}#</td>
      <td>${recharge.isUsed ? "Used" : "Not Used"}</td>
      <td>${recharge.createdAt}</td>
      <td>${!recharge.usedAt ? "---" : recharge.usedAt}</td>
      <td>
      ${
        recharge.isUsed
          ? '<button class="delete" onclick="deleteCode(' +
            index +
            ')">Delete Code</button>'
          : '<button class="copy" onclick="useCode(' +
            index +
            ')">Use Code</button>'
      }
      </td>
    </tr>`;
  }
};

displayCodes();

generateButton.addEventListener("click", () => {
  const network = networkInput.value;
  const amount = amountInput.value;

  if (!network || !amount) {
    alert("Please select a network and amount");
    return;
  }

  const code = Math.floor(100000 + Math.random() * 100000000000);

  codeInput.value = code;
  saveButton.disabled = false;
  tooltip.textContent = "This is your recharge code";
});

saveButton.addEventListener("click", () => {
  const code = codeInput.value;
  const network = networkInput.value;
  const amount = amountInput.value;
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const min =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const seconds =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  const rechargeObj = {
    network: network,
    amount: amount,
    code: code,
    createdAt: `${day}/${month}/${year} at ${hour}:${min}:${seconds}`,
    usedAt: null,
    isUsed: false,
  };

  const newRecharge = JSON.parse(localStorage.getItem("recharges"));
  newRecharge.push(rechargeObj);
  localStorage.setItem("recharges", JSON.stringify(newRecharge));
  alert("Code Saved!!");

  window.location.reload();
});

pinInput.addEventListener("input", (e) => {
  const pin = e.target.value;

  if (pin !== "") {
    rechargeButton.disabled = false;
  } else {
    rechargeButton.disabled = true;
  }
});

rechargeButton.addEventListener("click", () => {
  let success;
  const newRecharges = JSON.parse(localStorage.getItem("recharges"));

  for (let index = 0; index < newRecharges.length; index++) {
    const recharge = newRecharges[index];
    const code = `*311*${recharge.code}#`;

    if (code === pinInput.value) {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const min =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const hour =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const seconds =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

      recharge.isUsed = true;
      recharge.usedAt = `${day}/${month}/${year} at ${hour}:${min}:${seconds}`;
      localStorage.setItem("recharges", JSON.stringify(newRecharges));
      alert("Recharge Successful");
      success = true;
      break;
    }
  }

  if (!success) {
    alert("Recharge Failed. Check Code and try again.");
  } else {
    window.location.reload();
  }
});

const useCode = (index) => {
  const newRecharges = JSON.parse(localStorage.getItem("recharges"));
  const code = `*311*${newRecharges[index].code}#`;

  pinInput.value = code;
  rechargeButton.disabled = false;
};

const deleteCode = (index) => {
  const newRecharges = JSON.parse(localStorage.getItem("recharges"));
  newRecharges.splice(index, 1);
  localStorage.setItem("recharges", JSON.stringify(newRecharges));
  alert("Code Deleted");
  window.location.reload();
};
