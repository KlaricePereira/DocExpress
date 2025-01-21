$(document).ready(function () {
    // Função para garantir que apenas números sejam digitados
    function apenasNumeros(event) {
        var charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
        }
    }

    // Função para formatar o CPF com pontos e traço
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo o que não é número
        if (cpf.length <= 3) {
            return cpf;
        } else if (cpf.length <= 6) {
            return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        } else if (cpf.length <= 9) {
            return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        }
    }

    // Função para formatar data de YYYY-MM-DD para DD/MM/YYYY
    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo a função aos campos de CPF, RG e número do endereço (exceto número do endereço)
    $('#declarante_rg').on('keypress', apenasNumeros);
    $('#declarante_cpf').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    });
    $('#numero').on('keypress', function (event) {
        // Não faz a restrição de números no campo 'numero', permitindo caracteres
        return true;
    });

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#declarante_nome').val(),
            $('#declarante_rg').val(),
            $('#declarante_cpf').val(),
            $('#rua').val(),
            $('#numero').val(),
            $('#bairro').val(),
            $('#cidade').val(),
            $('#estado').val(),
            $('#cep').val(),
            $('#data_inicio_residencia').val(),
            $('#checkbox_termos').is(':checked') // Verifica se o checkbox foi marcado
        ];

        // Se algum campo estiver vazio ou o checkbox não estiver marcado, retorna falso
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
        const declaranteNome = $('#declarante_nome').val();
        const declaranteRG = $('#declarante_rg').val();
        const declaranteCPF = $('#declarante_cpf').val();
        const rua = $('#rua').val();
        const numero = $('#numero').val();
        const bairro = $('#bairro').val();
        const cidade = $('#cidade').val();
        const estado = $('#estado').val();
        const cep = $('#cep').val();
        const dataInicioResidenciaISO = $('#data_inicio_residencia').val();
        const dataInicioResidencia = formatarData(dataInicioResidenciaISO);

        // Configurações gerais
        const margemEsquerda = 10; // Margem esquerda do documento
        const larguraTexto = 190; // Largura máxima do texto (A4 = 210mm - margens)
        let y = 40; // Posição inicial no eixo Y

        doc.setFontSize(12);

        // Título do documento
        doc.text('AUTODECLARAÇÃO DE RESIDÊNCIA', 105, 20, null, null, 'center');

        // Corpo do documento com o texto justificado
        const textoCorpo = `Eu, ${declaranteNome}, RG nº ${declaranteRG} e CPF nº ${declaranteCPF}, residente e domiciliado à 
${rua}, nº ${numero}, bairro ${bairro}, cidade ${cidade} - ${estado}, CEP: ${cep}, declaro, 
para os devidos fins, que sou residente no endereço acima mencionado desde ${dataInicioResidencia}.`;
        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        // Declaração adicional
        const textoAdicional = 'Declaro, ainda, que as informações acima são verdadeiras e que estou ciente de que a falsidade dessa declaração pode implicar em sanções penais e civis.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8;

        // Local e Data
        doc.text('Local e data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 20;

        // Assinatura
        doc.text('Assinatura do Declarante:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        // Gerando e salvando o PDF
        doc.save('autodeclaracao_residencia.pdf');
    });
});
