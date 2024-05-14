
let btn_fazer_nova_clicked = false
let btn_reutilizar_clicked = false

function busca_cnpj(){
    

    cnpj_busca = document.getElementById("input_cnpj");
    cnpj_busca = cnpj_busca.value;
    cnpj_busca = cnpj_busca.replace(".","").replace("/","").replace("-","").replace(".","");

    document.getElementById("razao_social").innerHTML = "BUSCANDO...";
    document.getElementById("cnpj").innerHTML = "BUSCANDO...";
    document.getElementById("comercial").innerHTML = "BUSCANDO...";
    document.getElementById("cnae_principal").innerHTML = "BUSCANDO...";
    document.getElementById("segmento").innerHTML = "BUSCANDO...";

    document.getElementById("faturamento_anual").value = "BUSCANDO...";
    document.getElementById("qtd_funcionarios").value = "BUSCANDO...";
    document.getElementById("folha_salarial").value = "BUSCANDO...";

    console.log(cnpj_busca);

    fetch('https://api-chat.taxchatbot.click/empresas/cnpj/' + cnpj_busca)
    .then((response)=> response.json())
    .then((response)=> {

        fetch('https://api-chat.taxchatbot.click/propostas/empresaid/' + response["id"]).then((proposta_recuperada)=> proposta_recuperada.json())
            .then((proposta_recuperada)=> {
                

                if (proposta_recuperada.length >= 1){
                    document.getElementById("proposta_encontrada").showModal();

                    document.getElementById("btn_fazer_nova").onclick = () => {
                        popula_basicos();
                        popula_ajuizadas();
                        document.getElementById("proposta_encontrada").close();
                    }

                    document.getElementById("btn_reutilizar").onclick = () => {
                        popula_basicos();
                        popula_ajuizadas();
                        popula_proposta();
                        document.getElementById("proposta_encontrada").close();
                    }
                } else {
                    popula_ajuizadas();
                    popula_basicos();
                }
                
                function popula_proposta(){
                    lista_teses_finais = document.getElementById('teses_finais');
                    
                    teses_finais_proposta  = proposta_recuperada[proposta_recuperada.length-1]["tesesOferecidas"];

                    console.log(teses_finais_proposta);
                    for (var i = 0; i < teses_finais_proposta.length; i++) {
                        
                        //Criando li que vai armazenar as infos
                        li = document.createElement("li");
        
                        //Adicionando a classe para estilo ao li
                        li.setAttribute('class', 'teses__item');
        
                        //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE
                        checkbox = document.createElement("input");
                        checkbox.setAttribute('type', 'checkbox');
                        li.appendChild(checkbox);
        
                        //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE
                        id_tese = document.createElement("p");
                        id_tese.setAttribute('class', 'itens__id');
                        texto_id = document.createTextNode(teses_finais_proposta[i]['id']);
                        id_tese.appendChild(texto_id);
                        li.appendChild(id_tese);
        
                        //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                        descricao_tese = document.createElement("p");
                        descricao_tese.setAttribute('class', 'itens__descricao');
                        descricao_tese.setAttribute('onclick', 'exibeTextoCompleto("' + teses_finais_proposta[i]['descricaoTese'] + '")')
                        abbr_descricao = document.createElement("abbr")
                        texto_descricao = document.createTextNode(teses_finais_proposta[i]['descricaoTese']);
                        abbr_descricao.setAttribute('title', teses_finais_proposta[i]['descricaoTese']);
                        abbr_descricao.appendChild(texto_descricao);
                        descricao_tese.appendChild(abbr_descricao);
        
                        li.appendChild(descricao_tese);
        
                        //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                        percentual_tese = document.createElement("p");
                        percentual_tese.setAttribute('class', 'itens__percentual');
                        percentual_api = teses_finais_proposta[i]['percentual']*100;
                        percentual_api = percentual_api.toString().substring(0, 6);
                        texto_percentual = document.createTextNode(percentual_api);
                        percentual_tese.appendChild(texto_percentual);
                        li.appendChild(percentual_tese);
        
        
                        lista_teses_finais.appendChild(li);
                    
                    
                    }

                    teses_ajuizadas_api = response['processos']

                    let id_ajuizadas = new Array();
                        for (var j = 0; j < teses_ajuizadas_api.length; j++) {

                            try{
                                id_ajuizadas.push(teses_ajuizadas_api[j]['tese']['id'].toString());
                            } catch {
                                console.log('passou');
                            }
                        }
                    
                    ul_finais = document.getElementById('teses_finais');

                    for(var i=0; i <= ul_finais.children.length; i++){
                        
                                
                        try{
                            if (id_ajuizadas.indexOf(ul_finais.children[i].children[1].innerHTML.toString()) > -1) {
                                ul_finais.removeChild(ul_finais.children[i]);
                            }  
                        } catch {
                            console.log(ul_finais.children[i]);
                        }
                    }
                }
               
        });

        

        function popula_basicos() {
            document.getElementById("razao_social").innerHTML = response['razaoSocial'];
            document.getElementById("cnpj").innerHTML = response['cnpj'];
            document.getElementById("comercial").innerHTML = response['comercial']['nomeComercial'];
            document.getElementById("cnae_principal").innerHTML = response['cnaePrincipal'];
            document.getElementById("segmento").innerHTML = response['segmento']['descricaoSegmento'];

            document.getElementById("faturamento_anual").value = response['faturamentoAnual'];
            document.getElementById("qtd_funcionarios").value = response['quantidadeFuncionarios'];
            document.getElementById("folha_salarial").value = response['folhaDePagamento'];

            //Pegando teses aplicaveis
            lista_teses_aplicaveis = document.getElementById('teses_aplicaveis');

            
            teses_aplicaveis_api = response['segmento']['teses_aplicaveis']

            if (teses_aplicaveis_api.length > 0){
                for (var i = 0; i < teses_aplicaveis_api.length; i++) {
                    
                    //Criando li que vai armazenar as infos
                    li = document.createElement("li");

                    //Adicionando a classe para estilo ao li
                    li.setAttribute('class', 'teses__item');

                    //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE
                    checkbox = document.createElement("input");
                    checkbox.setAttribute('type', 'checkbox');
                    li.appendChild(checkbox);

                    //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE
                    id_tese = document.createElement("p");
                    id_tese.setAttribute('class', 'itens__id');
                    texto_id = document.createTextNode(teses_aplicaveis_api[i]['id']);
                    id_tese.appendChild(texto_id);
                    li.appendChild(id_tese);

                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    descricao_tese = document.createElement("p");
                    descricao_tese.setAttribute('class', 'itens__descricao');
                    descricao_tese.setAttribute('onclick', 'exibeTextoCompleto("' + teses_aplicaveis_api[i]['descricaoTese'] + '")')
                    abbr_descricao = document.createElement("abbr")
                    texto_descricao = document.createTextNode(teses_aplicaveis_api[i]['descricaoTese']);
                    abbr_descricao.setAttribute('title', teses_aplicaveis_api[i]['descricaoTese']);
                    abbr_descricao.appendChild(texto_descricao);
                    descricao_tese.appendChild(abbr_descricao);

                    li.appendChild(descricao_tese);

                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    percentual_tese = document.createElement("p");
                    percentual_tese.setAttribute('class', 'itens__percentual');
                    percentual_api = teses_aplicaveis_api[i]['percentual']*100;
                    percentual_api = percentual_api.toString().substring(0, 6);
                    texto_percentual = document.createTextNode(percentual_api);
                    percentual_tese.appendChild(texto_percentual);
                    li.appendChild(percentual_tese);


                    lista_teses_aplicaveis.appendChild(li);
                
                }
            } else {
                document.getElementById("sem_teses_aplicaveis").showModal();
            }

        teses_ajuizadas_api = response['processos']

        let id_ajuizadas = new Array();
            for (var j = 0; j < teses_ajuizadas_api.length; j++) {

                try{
                    id_ajuizadas.push(teses_ajuizadas_api[j]['tese']['id'].toString());
                } catch {
                    console.log('passou');
                }
            }
        
        ul_aplicaveis = document.getElementById('teses_aplicaveis');

        for(var i=0; i <= ul_aplicaveis.children.length; i++){
            
                    
            try{
                if (id_ajuizadas.indexOf(ul_aplicaveis.children[i].children[1].innerHTML.toString()) > -1) {
                    ul_aplicaveis.removeChild(ul_aplicaveis.children[i]);
                }  
            } catch {
                console.log(ul_aplicaveis.children[i]);
            }
        }
    }

        function popula_ajuizadas(){
            //Pegando teses aplicaveis
            lista_teses_ajuizadas = document.getElementById('teses_ajuizadas');
            
            teses_ajuizadas_api = response['processos']

            let id_ajuizadas = new Array();
                for (var j = 0; j < teses_ajuizadas_api.length; j++) {

                    try{
                        id_ajuizadas.push(teses_ajuizadas_api[j]['tese']['id'].toString());
                    } catch {
                        console.log('passou');
                    }
                }

            for (var i = 0; i < teses_ajuizadas_api.length; i++) {
                
                //Criando li que vai armazenar as infos
                li = document.createElement("li");

                //Adicionando a classe para estilo ao li
                li.setAttribute('class', 'teses__item');

                if(teses_ajuizadas_api[i]['tese'] != null){

                    btn_salvar = document.createElement("button");
                    btn_salvar.setAttribute("class", 'salvar_teses_ajuizadas');
                    btn_salvar.setAttribute('id', teses_ajuizadas_api[i]['numeroProcesso']);
                    btn_salvar.setAttribute('onclick', 'atualizaProcesso("' + teses_ajuizadas_api[i]['numeroProcesso'] + '")');

                    img_button_salvar = document.createElement('img');
                    img_button_salvar.setAttribute('src', 'img/salvar.png');
                    img_button_salvar.setAttribute('alt', 'Salvar');
                    img_button_salvar.setAttribute('width', '20px');
                    img_button_salvar.setAttribute('height', '20px');
                    

                    btn_salvar.appendChild(img_button_salvar);

                    li.appendChild(btn_salvar);

                    //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE
                    id_tese = document.createElement("input");
                    id_tese.setAttribute('class', 'input_teses');
                    id_tese.setAttribute('value', teses_ajuizadas_api[i]['tese']['id'])
                    id_tese.setAttribute('id', 'id_tese_' + teses_ajuizadas_api[i]['numeroProcesso'])
                    //texto_id = document.createTextNode(teses_ajuizadas_api[i]['id']);
                    //id_tese.appendChild(texto_id);
                    li.appendChild(id_tese);

                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    descricao_tese = document.createElement("p");
                    descricao_tese.setAttribute('class', 'itens__descricao');
                    descricao_tese.setAttribute('onclick', 'exibeTextoCompleto("' + teses_ajuizadas_api[i]['tese']['descricaoTese'] + '")');
                    descricao_tese.setAttribute('id', 'descricao_' + teses_ajuizadas_api[i]['numeroProcesso'])

                    abbr_descricao = document.createElement("abbr")
                    texto_descricao = document.createTextNode(teses_ajuizadas_api[i]['tese']['descricaoTese']);
                    abbr_descricao.setAttribute('title', teses_ajuizadas_api[i]['tese']['descricaoTese']);
                    abbr_descricao.setAttribute('id', 'abbr_' + teses_ajuizadas_api[i]['numeroProcesso']);
                    abbr_descricao.appendChild(texto_descricao);
                    descricao_tese.appendChild(abbr_descricao);

                    li.appendChild(descricao_tese);

                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    pedido_inicial = document.createElement("p");
                    pedido_inicial.setAttribute('class', 'itens__descricao');
                    pedido_inicial.setAttribute('onclick', 'exibeTextoCompleto("' + teses_ajuizadas_api[i]['pedidoInicial'] + '")');
                    pedido = teses_ajuizadas_api[i]['pedidoInicial'];
                    texto_pedido = document.createTextNode(pedido);
                    pedido_inicial.appendChild(texto_pedido);
                    li.appendChild(pedido_inicial);

                    lista_teses_ajuizadas.appendChild(li);
                
                } else {
                    //CRIANDO O PARAGRAFO DO ID E ADICIONANDO O TEXTO A ELE

                    btn_salvar = document.createElement("button");
                    btn_salvar.setAttribute("class", 'salvar_teses_ajuizadas');
                    btn_salvar.setAttribute('id', teses_ajuizadas_api[i]['numeroProcesso']);
                    btn_salvar.setAttribute('onclick', 'atualizaProcesso("' + teses_ajuizadas_api[i]['numeroProcesso'] + '")');

                    img_button_salvar = document.createElement('img');
                    img_button_salvar.setAttribute('src', 'img/salvar.png');
                    img_button_salvar.setAttribute('alt', 'Salvar');
                    img_button_salvar.setAttribute('width', '20px');
                    img_button_salvar.setAttribute('height', '20px');

                    btn_salvar.appendChild(img_button_salvar);

                    li.appendChild(btn_salvar);

                    id_tese = document.createElement("input");
                    id_tese.setAttribute('class', 'input_nao_teses');
                    id_tese.setAttribute('value', 'null')
                    id_tese.setAttribute('id', 'id_tese_' + teses_ajuizadas_api[i]['numeroProcesso'])
                    //texto_id = document.createTextNode(teses_ajuizadas_api[i]['id']);
                    //id_tese.appendChild(texto_id);
                    li.appendChild(id_tese);

                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    descricao_tese = document.createElement("p");
                    descricao_tese.setAttribute('class', 'itens__descricao_nao_tese');
                    descricao_tese.setAttribute('id', 'descricao_' + teses_ajuizadas_api[i]['numeroProcesso']);

                    abbr_descricao = document.createElement("abbr");
                    texto_descricao = document.createTextNode("Não é tese");
                    abbr_descricao.setAttribute('title', "Não é tese");
                    abbr_descricao.setAttribute('id', 'abbr_' + teses_ajuizadas_api[i]['numeroProcesso']);
                    abbr_descricao.appendChild(texto_descricao);
                    descricao_tese.appendChild(abbr_descricao);
                    li.appendChild(descricao_tese);
                    
                    //CRIANDO O PARAGRAFO DA DESCRICAO E ADICIONANDO O TEXTO A ELE
                    pedido_inicial = document.createElement("p");
                    pedido_inicial.setAttribute('class', 'itens__descricao');
                    pedido_inicial.setAttribute('onclick', 'exibeTextoCompleto("' + teses_ajuizadas_api[i]['pedidoInicial'] + '")');
                    pedido = teses_ajuizadas_api[i]['pedidoInicial'];
                    texto_pedido = document.createTextNode(pedido);
                    pedido_inicial.appendChild(texto_pedido);
                    li.appendChild(pedido_inicial);

                    lista_teses_ajuizadas.appendChild(li);

                }

            }
    }
    
    });
}


function atualizaProcesso(id){

    id_tratado = id.replace(".","").replace("-","").replace(".","").replace(".","").replace(".","");
    console.log(id_tratado)
    document.getElementById('registrando_alteracao').showModal();
    fetch('https://api-chat.taxchatbot.click/processos/num/' + id_tratado).then((response)=> response.json())
    .then((response)=> {

        id_tese = document.getElementById('id_tese_' + id).value;

        if(id_tese != 0){
            fetch('https://api-chat.taxchatbot.click/teses/' + id_tese).then((response_tese)=> response_tese.json())
            .then((response_tese)=> {

                document.getElementById("abbr_" + id).innerHTML = response_tese['descricaoTese'];
                document.getElementById("descricao_"+ id).setAttribute('onclick','exibeTextoCompleto("' + response_tese['descricaoTese'] + '")' );
                document.getElementById("descricao_"+ id).setAttribute('class','itens__descricao');

                response['tese'] = response_tese;

                var options = {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(response),
                    };
            
                fetch('https://api-chat.taxchatbot.click/processos/atualiza', options)
                .then((response_post) => response_post.json())
                .then((response_post => {
                    document.getElementById('registrando_alteracao').close();
                    document.getElementById('alteracao_gravada').showModal();
                    ul_aplicaveis = document.getElementById('teses_aplicaveis');
                    ul_finais = document.getElementById('teses_finais');
                    
                    for(var i=0; i <= ul_aplicaveis.children.length; i++) {

                        if (typeof ul_aplicaveis.children[i] != 'undefined') {
                            if (response_post['tese']['id'].toString() == ul_aplicaveis.children[i].children[1].innerHTML.toString()) {
                                     ul_aplicaveis.removeChild(ul_aplicaveis.children[i]);
                            } 
                        }
                
                    }

                    for(var i=0; i <= ul_finais.children.length; i++) {

                        if (typeof ul_finais.children[i] != 'undefined') {
                            if (response_post['tese']['id'].toString() == ul_finais.children[i].children[1].innerHTML.toString()) {
                                ul_finais.removeChild(ul_finais.children[i]);
                            } 
                        }
                
                    }
                })).catch(e => {
                    alert("Ocorreu uma falha, tente novamente: \n" + e);
                    console.log(e);
                });
                
            
            });
    } else {
        document.getElementById("abbr_" + id).innerHTML = "NÃO É TESE     ";
        response['tese'] = null; 
        var options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
            };
    
        fetch('https://api-chat.taxchatbot.click/processos/atualiza', options)
        .then((response_post) => response_post.json())
        .then((response_post => {
            document.getElementById('registrando_alteracao').close();
            document.getElementById('alteracao_gravada').showModal();
            ul_aplicaveis = document.getElementById('teses_aplicaveis');
            ul_finais = document.getElementById('teses_finais');
            for(var i=0; i <= ul_aplicaveis.children.length; i++) {
                
                for(var i=0; i <= ul_aplicaveis.children.length; i++) {

                    if (typeof ul_aplicaveis.children[i] != 'undefined') {
                        if (response_post['tese']['id'].toString() == ul_aplicaveis.children[i].children[1].innerHTML.toString()) {
                                 ul_aplicaveis.removeChild(ul_aplicaveis.children[i]);
                        } 
                    }    
                }
            }

            for(var i=0; i <= ul_finais.children.length; i++) {

                if (typeof ul_finais.children[i] != 'undefined') {
                    if (response_post['tese']['id'].toString() == ul_finais.children[i].children[1].innerHTML.toString()) {
                        ul_finais.removeChild(ul_finais.children[i]);
                    } 
                }
        
            }
        })).catch(e => {
            alert("Ocorreu uma falha, tente novamente: \n" + e);
            console.log(e);
        });
    }


    });

}

function exibeTextoCompleto(texto){
    alert(texto);
}

function transfere_para_selecionadas(){

    ul = document.getElementById('teses_aplicaveis');
    ul_selecionadas = document.getElementById('teses_selecionadas_analise');



    for(var i=0; i < ul.children.length; i++){
        
        try{
            if(ul.children[i].children[0].checked){
                ul.children[i].children[0].checked = false;
                ul_selecionadas.appendChild(ul.children[i]);
                i = 0;
            }
        } catch {

            if(ul.children[0].children[0].checked){
                ul.children[0].children[0].checked = false;
                ul_selecionadas.appendChild(ul.children[0]);
                i = 0;
            }
        }
    }
    

    if(ul.children[0].children[0].checked){
        ul.children[0].children[0].checked = false;
        ul_selecionadas.appendChild(ul.children[0]);
        i = 0;
    }
}

function transfere_para_finais(){

    ul = document.getElementById('teses_selecionadas_analise');
    ul_finais = document.getElementById('teses_finais');



    for(var i=0; i < ul.children.length; i++){

        try {    
            if(ul.children[i].children[0].checked){
                ul.children[i].children[0].checked = false;
                ul_finais.appendChild(ul.children[i]);
                i = 0;
            }
        } catch {
            if(ul.children[0].children[0].checked){
                ul.children[0].children[0].checked = false;
                ul_finais.appendChild(ul.children[0]);
                i=0;
            }
        }
    }

    if(ul.children[0].children[0].checked){
        ul.children[0].children[0].checked = false;
        ul_finais.appendChild(ul.children[0]);
        i=0;
    }
    

}

function return_aplicaveis(){

    ul = document.getElementById('teses_selecionadas_analise');
    ul_finais = document.getElementById('teses_finais');



    for(var i=0; i < ul_finais.children.length; i++){

        try{
            if(ul_finais.children[i].children[0].checked){
                ul_finais.children[i].children[0].checked = false;
                ul.appendChild(ul_finais.children[i]);
                i = 0;
            }
        } catch {
            if(ul_finais.children[0].children[0].checked){
                ul_finais.children[0].children[0].checked = false;
                ul.appendChild(ul_finais.children[0]);
                i=0;
            }
        }
    }

    
    if(ul_finais.children[0].children[0].checked){
        ul_finais.children[0].children[0].checked = false;
        ul.appendChild(ul_finais.children[0]);
        i=0;
    }
}

function return_selecionaveis(){

    ul = document.getElementById('teses_aplicaveis');
    ul_selecionadas = document.getElementById('teses_selecionadas_analise');



    for(var i=0; i < ul_selecionadas.children.length; i++){
        try{
            if(ul_selecionadas.children[i].children[0].checked){
                ul_selecionadas.children[i].children[0].checked = false;
                ul.appendChild(ul_selecionadas.children[i]);
                i = 0;
            }
        } catch {
            if(ul_selecionadas.children[0].children[0].checked){
                ul_selecionadas.children[0].children[0].checked = false;
                ul.appendChild(ul_selecionadas.children[0]);
                i=0;
            }
        }
    }

    if(ul_selecionadas.children[0].children[0].checked){
        ul_selecionadas.children[0].children[0].checked = false;
        ul.appendChild(ul_selecionadas.children[0]);
        i=0;
    }
    
}


function limpa() {
    document.getElementById("input_cnpj").value = "";
    document.getElementById("razao_social").innerHTML = "";
    document.getElementById("cnpj").innerHTML = "";
    document.getElementById("comercial").innerHTML = "";
    document.getElementById("cnae_principal").innerHTML = "";
    document.getElementById("segmento").innerHTML = "";
    document.getElementById("faturamento_anual").value = "";
    document.getElementById("qtd_funcionarios").value = "";
    document.getElementById("folha_salarial").value = "";

    ul_remove_ajuizadas = document.getElementById('teses_ajuizadas');
    ul_remove_aplicaveis = document.getElementById('teses_aplicaveis');
    ul_teses_selecionadas_analise = document.getElementById('teses_selecionadas_analise');
    ul_teses_finais = document.getElementById('teses_finais');

    try {
        for(var i=0; i <= ul_remove_ajuizadas.children.length; i++){
        
            ul_remove_ajuizadas.removeChild(ul_remove_ajuizadas.children[i]);
            i=0;
        }

    } catch {
        ul_remove_ajuizadas.removeChild(ul_remove_ajuizadas.children[0]);
    }
    

    try {
        for(var i=0; i <= ul_remove_aplicaveis.children.length; i++){
        
            ul_remove_aplicaveis.removeChild(ul_remove_aplicaveis.children[i]);
            i=0;
        }

    } catch {
        ul_remove_aplicaveis.removeChild(ul_remove_aplicaveis.children[0]);
    }

    try {
        for(var i=0; i <= ul_teses_selecionadas_analise.children.length; i++){
        
            ul_teses_selecionadas_analise.removeChild(ul_teses_selecionadas_analise.children[i]);
            i=0;
        }

    } catch {
        try {
            ul_teses_selecionadas_analise.removeChild(ul_teses_selecionadas_analise.children[0]);
        } catch {
            console.log(ul_teses_selecionadas_analise.children[0]);
        }
    }

    try {
        for(var i=0; i <= ul_teses_finais.children.length; i++){
        
            ul_teses_finais.removeChild(ul_teses_finais.children[i]);
            i=0;
        }

    } catch {
        ul_teses_finais.removeChild(ul_teses_finais.children[0]);
    }

}

function grava_proposta(){

    document.getElementById("registrando_proposta").showModal();

    cnpj_busca = document.getElementById("input_cnpj");
    cnpj_busca = cnpj_busca.value;
    cnpj_busca = cnpj_busca.replace(".","").replace("/","").replace("-","").replace(".","");


    fetch('https://api-chat.taxchatbot.click/empresas/cnpj/' + cnpj_busca)
    .then((empresa)=> empresa.json())
    .then((empresa)=> {

        proposta = {
            "id": null,
            "empresa": empresa
        }
        ul_finais = document.getElementById('teses_finais');
        
        var options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(proposta),
            };
        
        fetch('https://api-chat.taxchatbot.click/propostas', options)
        .then((proposta_post) => proposta_post.json())
        .then((proposta_post => {
            
            for(var i=0; i < ul_finais.children.length; i++){
            
                try{
                   
                fetch('https://api-chat.taxchatbot.click/teses/' + ul_finais.children[i].children[1].innerHTML).then((tese)=> tese.json())
                .then((tese)=> {
                    

                    proposta_att = {
                        "proposta": proposta_post,
                        "tese": tese
                    }
                    var options_2 = {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(proposta_att),
                        };
                    
                        fetch('https://api-chat.taxchatbot.click/propostas/addtese', options_2)
                        .then((proposta_att_response) => proposta_att_response.json())
                        .then((proposta_att_response => {
                            document.getElementById("registrando_proposta").close();
                            document.getElementById("proposta_gravada").showModal();
                            
                
                        })).catch(e => {
                            alert("Ocorreu uma falha, tente novamente: \n" + e);
                            console.log(e);
                        });
                });
                } catch{
                    console.log('fodase');
                }
                
            }

        })).catch(e => {
            alert("Ocorreu uma falha, tente novamente: \n" + e);
            console.log(e);
        });
        
    
    });

}

function fechaAlerta(){
    document.getElementById("proposta_gravada").close();
    limpa();
}

function fechaAlteracao(){
    document.getElementById("alteracao_gravada").close();
}

function fechaOkSemTese(){
    document.getElementById("sem_teses_aplicaveis").close();
}

function fazer_nova_clicked(){
    btn_fazer_nova_clicked = true;
}

function retutilizar(){
    btn_reutilizar_clicked = true;
}
