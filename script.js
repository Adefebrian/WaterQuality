
const getData = async () => {
  const response = await fetch(
    "https://iot-rest-api-production.up.railway.app/api/conductivities/get/last"
  );
  const data = await response.json();
  return data;
};

const fetchDataButton = document.getElementById("fetch-data");
fetchDataButton.addEventListener("click", () => {
  getData().then((res) => {
    const id = res.data[0].id;
    if (res.data[0].location == null) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const pos = `${position.coords.latitude},${position.coords.longitude}`;
        navigator.geolocation.getCurrentPosition(async (position) => {
          const pos = `${position.coords.latitude},${position.coords.longitude}`;
          const response = await axios.put(
            `https://iot-rest-api-production.up.railway.app/api/conductivities/${id}`,
            {
              location: pos,
            }
          );

          const data = await response;
        });
      });
    }
    const locationElement = document.getElementById("data-location");
    const tdsElement = document.getElementById("data-tds");
    const isSafeElement = document.getElementById("data-is-safe");
    // locationElement.innerText = res.data[0].location;
    locationElement.innerHTML = `<a href="https://www.google.com/maps/search/?api=1&query=${res.data[0].location}" target="_blank">Open in Google Map</a>`;
    tdsElement.innerText = res.data[0].tds + " PPM";
    isSafeElement.innerHTML = `<span class="badge ${res.data[0].is_safe ? "bg-success text-white" : "bg-danger text-white"
      }">${res.data[0].is_safe ? "Safe" : "Not Safe"}</span>
    `;

    if (res.data[0].is_safe == true) {
      document.getElementById("data-keterangan").innerHTML = `Air dengan kualitas Total Dissolved Solids (TDS) hasil pengecekan anda sebesar ${res.data[0].tds} PPM yang artinya dianggap sebagai air yang berkualitas baik dan dapat digunakan untuk berbagai keperluan, antara lain: <ul><li><strong>Konsumsi</strong>: Air dengan TDS di bawah 300 ppm dapat digunakan untuk minum, memasak, dan menyiapkan makanan.</li><li><strong>Pertanian</strong>: Air dengan TDS rendah dapat digunakan untuk menyiram tanaman dan untuk menyediakan air yang baik untuk pertumbuhan tanaman.</li><li><strong>Industri</strong>: Air dengan TDS rendah dapat digunakan dalam industri pembuatan makanan, farmasi, dan tekstil, karena air ini tidak akan menyebabkan korosi pada mesin-mesin yang digunakan.</li><li><strong>Air minum</strong>: Air dengan TDS yang rendah dapat digunakan sebagai sumber air minum yang baik dan sehat,</li><li><strong>Air pendingin</strong>: Air dengan TDS rendah juga dapat digunakan sebagai air pendingin dalam sistem pendingin udara atau pendingin mesin.</li></ul>`;;
      const joinUsButton = document.createElement("button");
      joinUsButton.innerHTML = "Join Us";
      joinUsButton.classList.add("btn", "btn-success", "join-us-btn");
      joinUsButton.addEventListener("click", function(){
        window.location.href = "https://wa.me/1234567890";
      })
      document.body.appendChild(joinUsButton);
    } else {
      document.getElementById("data-keterangan").innerHTML = `Air dengan kualitas Total Dissolved Solids (TDS) hasil pengecekan anda sebesar ${res.data[0].tds} PPM yang artinya dianggap sebagai air dengan kualitas yang kurang baik dan tidak cocok untuk beberapa keperluan, maka dari itu kita perlu melakukan filterasi air dengan alat <strong>Waterkeun</strong> yang bisa anda dapatkan jika bergabung dengan kami. Berikut adalah beberapa masalah jika anda tidak melakukan filterasi air dengan TDS tinggi : <ul><li><strong>Rasa dan bau tidak enak: </strong>Tingginya jumlah mineral dalam air dapat menyebabkan rasa dan bau yang tidak enak.</li><li><strong>Resiko kesehatan: </strong>Air yang memiliki TDS tinggi dapat menyebabkan masalah kesehatan jika dikonsumsi dalam jangka panjang, seperti masalah ginjal dan jantung.</li><li><strong>Masalah dalam pertanian: </strong>Air yang memiliki TDS tinggi dapat menyebabkan korosi pada peralatan dan mesin dalam industri, sehingga dapat menurunkan efisiensi dan meningkatkan biaya perawatan.</li><li><strong>Kegagalan dalam pertanian: </strong>Tingginya TDS dalam air dapat menyebabkan tanaman tidak tumbuh dengan baik atau mati, terutama jika tingkat TDS melebihi tingkat yang dapat diterima oleh jenis tanaman tertentu.`;
      const getRecommendationButton = document.createElement("button");
      getRecommendationButton.innerHTML = "Get Recommendation";
      getRecommendationButton.classList.add("btn", "btn-danger", "get-recommendation-btn");
      getRecommendationButton.addEventListener("click", showPartners);
      getRecommendationButton.addEventListener("click", function(){
        window.location.href = "#partners-container";
      })
      document.body.appendChild(getRecommendationButton);
    }
  });
});

function showPartners(){
  const partnersUrl = 'https://iot-rest-api-production.up.railway.app/api/partners'
  fetch(partnersUrl)
  .then((response) => response.json())
  .then((data) => {
    const partners = data.data.slice(0, 4);
    const partnersContainer = document.getElementById("partners-container");
    let partnersCards = '';
    partners.forEach((partner) => {
      partnersCards += `<div id="partner-card" class="card" style="width: 18rem;">
      <div class="card-body"></div>
        <h5 class="card-title">${partner.name}</h5>
        <p class="card-text"><a href="tel:${partner.phone}">${partner.phone}</a></p>
        <p class="card-text"><a href="https://www.google.com/maps/search/?api=1&query=${partner.location}" target="_blank">Open in Google Maps</a></p>
      </div>
    </div>`;
    });
    partnersContainer.innerHTML = partnersCards;
  });
}