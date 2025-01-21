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
    $('#declarante_rg').on('keypress', apenasNumeros);
    $('#declarante_cpf').on('keypress', apenasNumeros);
    $('#residente_rg').on('keypress', apenasNumeros);
    $('#residente_cpf').on('keypress', apenasNumeros);

    // Formatação de CPF automaticamente
    $('#declarante_cpf').on('input', function() { formatarCPF(this); });
    $('#residente_cpf').on('input', function() { formatarCPF(this); });

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#declarante_nome').val(),
            $('#declarante_rg').val(),
            $('#declarante_cpf').val(),
            $('#residente_nome').val(),
            $('#residente_rg').val(),
            $('#residente_cpf').val(),
            $('#endereco').val(),
            $('#numero').val(),
            $('#bairro').val(),
            $('#cidade').val(),
            $('#estado').val(),
            $('#cep').val(),
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
        const declaranteNome = $('#declarante_nome').val();
        const declaranteRG = $('#declarante_rg').val();
        const declaranteCPF = $('#declarante_cpf').val();
        const residenteNome = $('#residente_nome').val();
        const residenteRG = $('#residente_rg').val();
        const residenteCPF = $('#residente_cpf').val();
        const endereco = $('#endereco').val();
        const numero = $('#numero').val();
        const bairro = $('#bairro').val();
        const cidade = $('#cidade').val();
        const estado = $('#estado').val();
        const cep = $('#cep').val();

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 180; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('DECLARAÇÃO DE RESIDÊNCIA', 105, 20, null, null, 'center');

        // Corpo do documento com o texto justificado
        const textoCorpo = `Eu, ${declaranteNome}, RG: ${declaranteRG}, CPF: ${declaranteCPF}, declaro para os devidos fins que ${residenteNome}, RG: ${residenteRG}, CPF: ${residenteCPF}, reside no meu endereço ${endereco}, nº ${numero}, bairro ${bairro}, cidade ${cidade}, estado ${estado}, CEP ${cep}.`;

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
        doc.text('Assinatura do Declarante:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('declaracao_residencia.pdf');
    });
});
