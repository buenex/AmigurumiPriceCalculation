let products = getStorage("products");
updateProductList()

function addProduct() {
    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const value = parseFloat(document.getElementById('productValue').value);
    const weight = parseFloat(document.getElementById('productWeight').value);
    if (id && name && !isNaN(value) && !isNaN(weight)) {
        saveToStorage("products",{ id, name, value, weight })
        products = getStorage("products");
        updateProductList();
        closeModal();
        alert('Produto cadastrado com sucesso!');
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

function updateProductList() {
    const selectProduct = document.getElementById('selectProduct');
    selectProduct.innerHTML = '';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        selectProduct.appendChild(option);
    });
}

function calculateFinalValue() {
    const productId = document.getElementById('selectProduct').value;
    const weight = parseFloat(document.getElementById('inputWeight').value);
    const product = products.find(p => p.id === productId);
    const time = parseFloat(document.getElementById('inputWorkedTime').value);
    const txtTooltip = document.getElementById('tooltip');

    if (product && !isNaN(weight)) {
        const productUsed = (weight*product.value)/product.weight
        const totalCostTime = ((time/60))
        const finalValue = calcularPrecoSugerido(totalCostTime,productUsed);
        
        document.getElementById('finalValue').textContent = `R$ ${finalValue.toFixed(2)}`;
        txtTooltip.innerHTML=`O valor final foi formado da seguinte forma: <br><br>
                                Produto gasto: R$ ${parseFloat(productUsed).toFixed(2)} <br>
                                Custo do tempo: ${parseFloat(totalCostTime).toFixed(2)} hora(s)
                             `
    } else {
        alert('Por favor, selecione um produto e insira um peso válido.');
    }
}

function calcularPrecoSugerido(tempoGasto, materiaPrimaGasta) {
    // Definindo as constantes
    const lastModifier = localStorage.getItem("lastModifier")
    const lastMinimumProfit = localStorage.getItem("lastMinimumProfit")
    const lastModifierUsed = lastModifier==null?1:lastModifier/10
    const a = lastModifierUsed;
    const b = 0.01;
    
    // Calculando o custo total
    const custoTotal = tempoGasto + materiaPrimaGasta;
    
    // Calculando o modificador
    const modificador = 1 / (a + b * (tempoGasto + materiaPrimaGasta));
    
    // Garantindo que o modificador seja no mínimo 5
    const modificadorFinal = Math.max(lastMinimumProfit, modificador);
    
    // Calculando o preço sugerido
    const precoSugerido = custoTotal * modificadorFinal;
    
    return precoSugerido;
  }

  

function openModal(numberId) {
    //Insert logic to found product by id
    const id = document.getElementById('productId');
    id.value = numberId==0?Date.now():numberId
    document.getElementById('productModal').style.display = 'block';

    document.getElementById('productName').value="";
    document.getElementById('productValue').value=0;
    document.getElementById('productWeight').value=0;
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function saveToStorage(storageName,obj){
    var list = getStorage(storageName)
    list.push(obj)

    localStorage.setItem(storageName,JSON.stringify(list))
}

function getStorage(storageName){
    var list = JSON.parse(localStorage.getItem(storageName))
    return list==null?[]:list
}

function getStorageById(storageName,id){
    var list = getStorage(storageName)
    return list.filter((obj)=>obj.id==id)[0]
}

function editProduct(){
    const productSelected = document.getElementById('selectProduct');
    const name = document.getElementById('productName');
    const value = document.getElementById('productValue');
    const weight = document.getElementById('productWeight');

    var idToEdit = productSelected.options[productSelected.selectedIndex].value;

    var obj = getStorageById("products",idToEdit)

    openModal(idToEdit)

    name.value = obj.name
    value.value = parseFloat(obj.value)
    weight.value = parseFloat(obj.weight)
}

function toggleSettingsMenu() {
    const menu = document.getElementById('settingsOptions');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function openSettingsModal(option) {
    const modal = document.getElementById('settingsModal');
    const title = document.getElementById('settingsTitle');
    const content = document.getElementById('settingsContent');
    content.innerHTML=""
    if (option === 'configuracoes') {
        title.textContent = 'Configurações';
        content.innerHTML = `
        <p>Esse modificador serve para calcular a sugestao do preco, quanto menor o valor maior a margem sugerida.</p>
        <h4>Modificador de lucro</h4>
        <div style="display: flex; align-items: center;">0<input type="range" id="modifier" name="volume" min="1" max="10" step="0.1" onchange="changeModifier()"/>10</div><br>
        <h4>Lucro minimo</h4>
        <div style="display: flex; align-items: center;">2<input type="range" id="minimumProfit" name="volume" min="2" max="10" step="1" onchange="changeMinimumProfit()"/>10</div>
        `;
        var modifier = document.getElementById("modifier")
        var lastModifier = localStorage.getItem("lastModifier")
        const lastModifierUsed = lastModifier==null?1:lastModifier
        modifier.value = lastModifierUsed

        var minimumProfit = document.getElementById("minimumProfit")
        var lastMinimumProfit = localStorage.getItem("lastMinimumProfit")
        const lastMinimumProfitUsed = lastMinimumProfit==null?2:lastMinimumProfit
        minimumProfit.value = lastMinimumProfitUsed
    } else if (option === 'idioma') {
        title.textContent = 'Idioma';
        content.innerHTML=`
        <p>Coming soon.</p>
        
        `;
    }
    
    modal.style.display = 'block';
    toggleSettingsMenu();
}

function changeProduct(){
    var select = document.getElementById("selectProduct")
    localStorage.setItem("lastUsed",select.value)
}

function changeModifier(){
    var modifier = document.getElementById("modifier")
    localStorage.setItem("lastModifier",modifier.value)

}

function changeMinimumProfit(){
    var minimumProfit = document.getElementById("minimumProfit")
    localStorage.setItem("lastMinimumProfit",minimumProfit.value)

}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

function onLoad(){
    var select = document.getElementById("selectProduct")
    var lastProduct = localStorage.getItem("lastUsed")

    const lastProductUsed = lastProduct==null?0:lastProduct

    if (lastProductUsed!=0){
        select.value = lastProductUsed
    }
}

onLoad()
