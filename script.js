// Load products dynamically
fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">$${product.price} <span>/ one-time</span></div>
        <button onclick="payNow(${product.price}, '${product.name}')">Join Now</button>
      `;
      container.appendChild(card);
    });
  });

// Payment via Flutterwave
function payNow(amount, plan){
  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-xxxxxxxxxxxx", // replace with your test/live key
    tx_ref: "fan_" + Date.now(),
    amount,
    currency: "USD",
    payment_options: "card,paypal",
    customer: { email: "fan@example.com" },
    customizations: { title: "Official Fan Club VIP", description: plan },
    callback: function(res){
      if(res.status === "successful") activateMembership(plan);
    }
  });
}

// Activate membership + QR
function activateMembership(plan){
  const memberId = "FAN-" + Math.floor(100000 + Math.random()*900000);
  document.querySelector(".pricing").style.display = "none";
  document.getElementById("success").classList.remove("hidden");
  document.getElementById("memberId").innerText = memberId;
  document.getElementById("memberPlan").innerText = plan;

  localStorage.setItem("memberId", memberId);
  localStorage.setItem("memberPlan", plan);

  // Generate QR
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, { text: memberId, width:150, height:150 });
}

// Download card as PNG
function downloadCard(){
  const card = document.querySelector(".member-card");
  html2canvas(card).then(canvas => {
    const link = document.createElement("a");
    link.download = "FanCard.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
