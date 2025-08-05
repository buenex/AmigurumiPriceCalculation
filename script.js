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
        txtTooltip.innerHTML=localStorage.getItem("lang")=="pt"?`O valor final foi formado da seguinte forma: <br><br>
                                Produto gasto: R$ ${parseFloat(productUsed).toFixed(2)} <br>
                                Custo do tempo: ${parseFloat(totalCostTime).toFixed(2)} hora(s)
                             `:`The final value is made as follow: <br><br>
                                Product used: R$ ${parseFloat(productUsed).toFixed(2)} <br>
                                Time coast: ${parseFloat(totalCostTime).toFixed(2)} hour(s)
                             `;
    } else {
        alert(localStorage.getItem("lang")=="en"?'Please, select a product and insert a valid weight!':'Por favor, selecione um produto e insira um peso válido!');
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
        title.textContent = localStorage.getItem("lang")=="en"?"Settings":'Configurações';
        content.innerHTML = `
        <p data-i18n="modifierConfigInfo">Esse modificador serve para calcular a sugestao do preco, quanto menor o valor maior a margem sugerida.</p>
        <h4 data-i18n="modifierConfigTitle">Modificador de lucro</h4>
        <div style="display: flex; align-items: center;">0<input type="range" id="modifier" name="volume" min="1" max="10" step="0.1" onchange="changeModifier()"/>10</div><br>
        <h4 data-i18n="profitConfigTitle">Lucro minimo</h4>
        <div style="display: flex; align-items: center;">2<input type="range" id="minimumProfit" name="volume" min="2" max="10" step="1" onchange="changeMinimumProfit()"/>10</div>
        `;
        changeLanguage()
        var modifier = document.getElementById("modifier")
        var lastModifier = localStorage.getItem("lastModifier")
        const lastModifierUsed = lastModifier==null?1:lastModifier
        modifier.value = lastModifierUsed

        var minimumProfit = document.getElementById("minimumProfit")
        var lastMinimumProfit = localStorage.getItem("lastMinimumProfit")
        const lastMinimumProfitUsed = lastMinimumProfit==null?2:lastMinimumProfit
        minimumProfit.value = lastMinimumProfitUsed
    } else if (option === 'idioma') {
        langLastUsed = localStorage.getItem("lang")
        title.textContent = langLastUsed=="en"?"Language":"Idioma";
        content.innerHTML=`
        <div class="language-selector">
            <label for="languageSelect" data-i18n="titleLanguage">Selecione o idioma:</label>
            <select id="languageSelect" onchange="saveLanguage()">
                <option value="pt">Português (Brasil)</option>
                <option value="en">English</option>
            </select>
        </div>
        `;
        const selectLanguage = document.getElementById("languageSelect")
        selectLanguage.value = langLastUsed
        changeLanguage()
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
    changeLanguage()
}

const texts={
    "pt":{
        modifierConfigInfo:"Esse modificador serve para calcular a sugestao do preco, quanto menor o valor maior a margem sugerida.",
        modifierConfigTitle:"Modificador de lucro",
        profitConfigTitle:"Lucro minimo",
        titleLanguage:"Idioma",
        pageTitle:"Sistema de Cadastro de Produtos",
        configOpt1:"Configurações",
        configOpt2:"Idioma",
        titleDiv:"Sistema de Cadastro de Produtos",
        btnNewProduct:"Cadastrar Novo Produto",
        calculateFinalValue:"Calcular Valor Final",
        selectProductLabel:"Selecione o Produto:",
        weight:"Peso (gramas):",
        hoursWorked:"Horas trabalhadas(min):",
        calculate:"Calcular",
        suggestedFinalValue:`Valor Final sugerido: <span id="finalValue">R$ 0.00</span>
                                <span class="info-icon">
                                    <div class="tooltip" id="tooltip">
                                        Aqui você pode inserir informações adicionais sobre o valor final sugerido.
                                    </div>
                                </span>`,
        insertNewProduct:"Cadastrar Produto",
        productId:"ID do Produto:",
        productName:"Nome do Produto:",
        productValue:"Valor total do Produto:",
        productWeight:"Peso do Produto (gramas):",
        btnInsertProduct:"Cadastrar Produto",
    },
    "en":{
        modifierConfigInfo:"This modifier is to calculate the price suggestion,lower means that suggested price is higher.",
        modifierConfigTitle:"Profit modifier",
        profitConfigTitle:"Minimal profit",
        titleLanguage:"Language",
        pageTitle:"Amigurumi price calculator",
        configOpt1:"Settings",
        configOpt2:"Language",
        titleDiv:"System to calculate amigurumi price",
        btnNewProduct:"Insert new product",
        calculateFinalValue:"Calculate final value",
        selectProductLabel:"Select product:",
        weight:"Weight (grams):",
        hoursWorked:"Worked hours (min):",
        calculate:"Calculate",
        suggestedFinalValue:`Suggested final value: <span id="finalValue">R$ 0.00</span>
                            <span class="info-icon">
                                <div class="tooltip" id="tooltip">
                                    Here you can insert additional informations about suggested final value.
                                </div>
                            </span>`,
        insertNewProduct:"Insert new product",
        productId:"Product ID:",
        productName:"Product name:",
        productValue:"Product total value:",
        productWeight:"Product weight (grams):",
        btnInsertProduct:"Insert product",
    }
}

function saveLanguage() {
    const selectedLanguage = document.getElementById('languageSelect').value;
    localStorage.setItem("lang",selectedLanguage)
    changeLanguage()
}
function changeLanguage(){
    const elements = document.querySelectorAll('[data-i18n]');
    selectedLanguage = localStorage.getItem("lang")

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = texts[selectedLanguage][key];
    });
}

onLoad()
