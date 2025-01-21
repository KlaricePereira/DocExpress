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

    // Atribuindo a função de validação de números para os campos de CPF e RG
    $('#devedor_cpf').on('keypress', apenasNumeros);
    $('#credor_cpf').on('keypress', apenasNumeros);
    $('#devedor_rg').on('keypress', apenasNumeros);
    $('#credor_rg').on('keypress', apenasNumeros);

    // Formatação de CPF automaticamente
    $('#devedor_cpf').on('input', function() { formatarCPF(this); });
    $('#credor_cpf').on('input', function() { formatarCPF(this); });

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#devedor_nome').val(),
            $('#devedor_rg').val(),
            $('#devedor_cpf').val(),
            $('#credor_nome').val(),
            $('#credor_rg').val(),
            $('#credor_cpf').val(),
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

        // Coletando as variáveis do formulário
        const devedorNome = $('#devedor_nome').val();
        const devedorRG = $('#devedor_rg').val();
        const devedorCPF = $('#devedor_cpf').val();
        const credorNome = $('#credor_nome').val();
        const credorRG = $('#credor_rg').val();
        const credorCPF = $('#credor_cpf').val();
        const valor = $('#valor').val();
        const valorExtenso = $('#valor_extenso').val();
        const dataPagamento = $('#data_pagamento').val();
        const razao = $('#razao').val();

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 180; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('TERMO DE QUITAÇÃO', 105, 20, null, null, 'center');

        // Corpo do documento com o texto justificado
        const textoCorpo = `Eu, ${credorNome}, RG nº ${credorRG} e CPF nº ${credorCPF}, declaro para os devidos fins que recebi de ${devedorNome}, RG nº ${devedorRG} e CPF nº ${devedorCPF}, a quantia de R$ ${valor} (${valorExtenso}) no dia ${dataPagamento}, referente ao pagamento acordado para a razão: ${razao}.`;

        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        // Declaração adicional
        const textoAdicional = 'Declaro, ainda, que as informações acima são verdadeiras e estou ciente das responsabilidades legais decorrentes dessa declaração.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8;

        // Local e Data
        doc.text('Local e Data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 20;

        // Assinatura
        doc.text('Assinatura do Credor:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        doc.text('Assinatura do Devedor:', margemEsquerda, y + 20);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('termo_quitacao.pdf');
    });
});
