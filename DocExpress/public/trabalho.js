$(document).ready(function () {
    // Função para garantir que apenas números sejam digitados
    function apenasNumeros(event) {
        var charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Formatação automática de CPF (somente CPF tem formatação de pontos)
    function formatarCPF(campo) {
        let valor = campo.value.replace(/\D/g, '');  // Remove tudo o que não for número
        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        campo.value = valor;
    }

    // Função para formatar data no formato brasileiro (DD/MM/YYYY)
    function formatarData(dataISO) {
        if (!dataISO) return ""; // Retorna vazio caso o valor seja inválido
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo a função de validação de números para os campos de CPF e RG
    $('#rg').on('keypress', apenasNumeros);
    $('#cpf').on('keypress', apenasNumeros);

    // Formatação de CPF automaticamente
    $('#cpf').on('input', function() { formatarCPF(this); });

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#nome').val(),
            $('#nacionalidade').val(),
            $('#rg').val(),
            $('#cpf').val(),
            $('#endereco').val(),
            $('#numero').val(),
            $('#bairro').val(),
            $('#cidade').val(),
            $('#estado').val(),
            $('#atividade').val(),
            $('#data_inicio').val(),
            $('#rendimento').val(),
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

        // Coletando as variáveis do formulário
        const nome = $('#nome').val();
        const nacionalidade = $('#nacionalidade').val();
        const rg = $('#rg').val();
        const cpf = $('#cpf').val();
        const endereco = $('#endereco').val();
        const numero = $('#numero').val();
        const bairro = $('#bairro').val();
        const cidade = $('#cidade').val();
        const estado = $('#estado').val();
        const atividade = $('#atividade').val();
        const dataInicio = formatarData($('#data_inicio').val());  // Formata a data para o formato brasileiro
        const rendimento = $('#rendimento').val();

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 180; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('DECLARAÇÃO DE TRABALHADOR AUTÔNOMO', 105, 20, null, null, 'center');

        // Corpo do documento com o texto justificado
        const textoCorpo = `Eu, ${nome}, nacionalidade ${nacionalidade}, portador(a) do RG ${rg} e CPF ${cpf}, residente e domiciliado(a) na rua/av. ${endereco}, nº ${numero}, no bairro ${bairro}, cidade ${cidade}/${estado}, declaro para os devidos fins que exerço a atividade de ${atividade}, com início em ${dataInicio}, e que o meu rendimento mensal é de R$ ${rendimento}.`;

        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        // Local e Data
        doc.text('Local e data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 20;

        // Assinatura
        doc.text('Assinatura do Declarante:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('declaracao_trabalhador_autonomo.pdf');
    });
});
