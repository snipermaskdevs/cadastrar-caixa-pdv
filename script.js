const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const clientForm = document.getElementById("client-form");
const clientList = document.getElementById("client-list");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");
const paymentForm = document.getElementById("payment-form");
const paymentHistory = document.getElementById("payment-history");

let productData = [];
let clientData = [];
let paymentData = [];

// Adiciona um novo produto ao array
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    id: Date.now(), // Gerando um ID único com base no timestamp
    name: document.getElementById("name").value || "Não informado",
    price: document.getElementById("price").value || "Não informado",
    quantity: document.getElementById("quantity").value || "Não informado",
    category: document.getElementById("category").value || "Não informado",
    description: document.getElementById("description").value || "Não informado",
  };

  productData.push(newProduct);
  renderProductList();
  populateProductList(); // Atualiza a lista de produtos na seleção do pagamento
  productForm.reset();
});

// Renderiza a lista de produtos
function renderProductList() {
  productList.innerHTML = productData.map((product, index) => `
    <li>
      <div class="info">
        <span>Nome:</span> ${product.name}<br>
        <span>Preço:</span> R$ ${product.price}<br>
        <span>Quantidade:</span> ${product.quantity}<br>
        <span>Categoria:</span> ${product.category}<br>
        <span>Descrição:</span> ${product.description}
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
        <button class="delete-btn" onclick="deleteProduct(${index})">Excluir</button>
      </div>
    </li>
  `).join("");
}

// Edita um produto da lista
function editProduct(index) {
  const product = productData[index];
  document.getElementById("name").value = product.name !== "Não informado" ? product.name : "";
  document.getElementById("price").value = product.price !== "Não informado" ? product.price : "";
  document.getElementById("quantity").value = product.quantity !== "Não informado" ? product.quantity : "";
  document.getElementById("category").value = product.category !== "Não informado" ? product.category : "";
  document.getElementById("description").value = product.description !== "Não informado" ? product.description : "";

  deleteProduct(index);
}

// Exclui um produto da lista
function deleteProduct(index) {
  productData.splice(index, 1);
  renderProductList();
  populateProductList(); // Atualiza a lista de produtos na seleção do pagamento
}

// Função para preencher a lista de produtos no formulário de pagamento
function populateProductList() {
  const paymentProductSelect = document.getElementById('payment-product');
  
  // Limpar opções existentes
  paymentProductSelect.innerHTML = '<option value="">Selecione o Produto</option>';

  // Adicionar produtos ao campo de seleção
  productData.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id; // Usando o ID do produto
    option.textContent = product.name;
    paymentProductSelect.appendChild(option);
  });
}

// Adiciona um pagamento ao histórico, incluindo o produto selecionado
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedProductId = document.getElementById("payment-product").value;

  // Encontre o produto selecionado
  const selectedProduct = productData.find(product => product.id === selectedProductId);

  const newPayment = {
    client: document.getElementById("payment-client").value || "Não informado",
    amount: document.getElementById("payment-amount").value || "Não informado",
    method: document.getElementById("payment-method").value || "Não informado",
    product: selectedProduct ? selectedProduct.name : "Não informado", // Registra o nome do produto
  };

  paymentData.push(newPayment);
  renderPaymentHistory();
  paymentForm.reset();
});

// Renderiza o histórico de pagamentos com o produto adquirido
function renderPaymentHistory() {
  paymentHistory.innerHTML = paymentData.map((payment, index) => `
    <li>
      <div class="info">
        <span>Cliente:</span> ${payment.client}<br>
        <span>Valor:</span> R$ ${payment.amount}<br>
        <span>Método:</span> ${payment.method}<br>
        <span>Produto:</span> ${payment.product} <!-- Exibe o produto -->
      </div>
      <div class="actions">
        <button class="delete-btn" onclick="deletePayment(${index})">Excluir</button>
      </div>
    </li>
  `).join("");
}

// Exclui um pagamento do histórico
function deletePayment(index) {
  paymentData.splice(index, 1);
  renderPaymentHistory();
}

// Exporta os dados para um arquivo JSON
exportBtn.addEventListener("click", () => {
  const data = {
    clients: clientData,
    products: productData,
    payments: paymentData,
  };
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "business_data.json";
  link.click();
});

// Importa dados de um arquivo JSON
importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const importedData = JSON.parse(event.target.result);
      clientData = importedData.clients || [];
      productData = importedData.products || [];
      paymentData = importedData.payments || [];
      renderClientList();
      renderProductList();
      renderPaymentHistory();
    };
    reader.readAsText(file);
  }
});

// Função para preencher a lista de produtos no formulário de pagamento
function populateProductList() {
  const paymentProductSelect = document.getElementById('payment-product');
  
  // Limpar opções existentes
  paymentProductSelect.innerHTML = '<option value="">Selecione o Produto</option>';

  // Adicionar produtos ao campo de seleção
  productData.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id; // Usando o ID do produto
    option.textContent = product.name;
    paymentProductSelect.appendChild(option);
  });
}

// Chamar a função ao carregar a página
window.onload = function() {
  populateProductList();
};
