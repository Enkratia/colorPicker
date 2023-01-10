const colorPickerBtn = document.querySelector("#color-picker"),
  colorList = document.querySelector(".all-colors"),
  clearAll = document.querySelector(".clear-all"),
  pickedColors = JSON.parse(localStorage.getItem("picked-colors")) || [];

const copyColor = (elem) => {
  navigator.clipboard.writeText(elem.dataset.color);
  elem.innerText = "Copied";
  setTimeout(() => {
    elem.innerText = elem.dataset.color;
  }, 1000);
};

const showColors = () => {
  if (!pickedColors.length) return;

  colorList.innerHTML = pickedColors.map(color => `
        <li class="color">
          <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color};"></span>
          <span class="value" data-color="${color}">${color}</span>
        </li>
  `).join("");

  document.querySelector(".picked-colors").classList.remove("hide");

  document.querySelectorAll(".color").forEach(li => {
    li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
  });
};

showColors();

const activateEyeDropper = async () => {
  document.body.style.display = "none";

  try {
    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();
    navigator.clipboard.writeText(sRGBHex);

    if (!pickedColors.includes(sRGBHex)) {
      pickedColors.push(sRGBHex);
      localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
      showColors();
    }
  } catch (error) {
    console.log("Failed to copy.");
  }

  document.body.style.display = "block";
};

const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.clear();
  showColors();

  document.querySelector(".picked-colors").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);