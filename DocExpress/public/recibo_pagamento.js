$(document).ready(function () {
    // Função para garantir que apenas números sejam digitados
    function apenasNumeros(event) {
        var charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Função para formatar o CPF automaticamente
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');  // Remove tudo o que não for número
        
        if (cpf.length <= 11) {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf; // Retorna o CPF sem formatação se não tiver 11 caracteres
    }

    // Função para formatar a data no formato brasileiro (DD/MM/YYYY)
    function formatarData(dataISO) {
        if (!dataISO) return ""; // Retorna vazio caso o valor seja inválido
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo as funções aos campos de CPF e RG
    $('#recebedor_cpf').on('keypress', apenasNumeros)
        .on('input', function () {
            var cpf = $(this).val();
            // Aplica a formatação sempre que o usuário digitar
            $(this).val(formatarCPF(cpf));
        });

    $('#pagador_cpf').on('keypress', apenasNumeros)
        .on('input', function () {
            var cpf = $(this).val();
            // Aplica a formatação sempre que o usuário digitar
            $(this).val(formatarCPF(cpf));
        });

    // Função para validar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#recebedor_nome').val(),
            $('#recebedor_rg').val(),
            $('#recebedor_cpf').val(),
            $('#pagador_nome').val(),
            $('#pagador_rg').val(),
            $('#pagador_cpf').val(),
            $('#valor').val(),
            $('#valor_extenso').val(),
            $('#data_pagamento').val(),
            $('#razao').val(),
            $('#checkbox_termos').is(':checked') // Verifica se o checkbox foi marcado
        ];

        return camposObrigatorios.every(campo => campo !== "" && campo !== false);
    }

    // Ao clicar no botão de gerar PDF
    $('#gerarPDF').click(function () {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!validarCampos()) {
            alert('Por favor, preencha todos os campos obrigatórios antes de gerar o PDF.');
            return; // Impede a geração do PDF se algum campo estiver vazio
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Coletando os dados dos campos do formulário
        const recebedorNome = $('#recebedor_nome').val();
        const recebedorRG = $('#recebedor_rg').val();
        const recebedorCPF = $('#recebedor_cpf').val();
        const pagadorNome = $('#pagador_nome').val();
        const pagadorRG = $('#pagador_rg').val();
        const pagadorCPF = $('#pagador_cpf').val();
        const valor = $('#valor').val();
        const valorExtenso = $('#valor_extenso').val();
        const dataPagamento = formatarData($('#data_pagamento').val()); // Formata a data
        const razao = $('#razao').val();

        // Configurações do PDF
        const margemEsquerda = 10;
        const larguraTexto = 190;
        let y = 40;

        doc.setFontSize(12);

        // Título do documento
        doc.text('RECIBO DE PAGAMENTO', 105, 20, null, null, 'center');

        // Corpo do recibo com texto justificado
        const textoCorpo = `Eu, ${recebedorNome}, RG nº ${recebedorRG} e CPF nº ${recebedorCPF}, declaro para os devidos fins que recebi de ${pagadorNome}, RG nº ${pagadorRG} e CPF nº ${pagadorCPF}, a quantia de R$ ${valor} (${valorExtenso}) no dia ${dataPagamento}, referente a pagamento acordado.`;
        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        // Declaração de falsidade
        const textoAdicional = 'Declaro, ainda, que estou ciente de que a falsidade desta declaração pode implicar em sanções penais e civis.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8;

        // Local e Data
        doc.text('Local e Data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 20;

        // Assinatura
        doc.text('Assinatura do Recebedor:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('recibo_pagamento.pdf');
    });
});
