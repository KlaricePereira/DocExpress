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
        if (!dataISO) return ""; // Retorna vazio caso o valor seja inválido
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }

    // Atribuindo as funções aos campos de CPF e RG
    $('#responsavel_cpf, #acompanhante_cpf, #menor_cpf').on('input', function () {
        $(this).val(formatarCPF($(this).val()));
    }).on('keypress', apenasNumeros);
    $('#responsavel_rg, #acompanhante_rg').on('keypress', apenasNumeros);

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function validarCampos() {
        const camposObrigatorios = [
            $('#responsavel_nome').val(),
            $('#responsavel_nacionalidade').val(),
            $('#responsavel_rg').val(),
            $('#responsavel_cpf').val(),
            $('#responsavel_endereco').val(),
            $('#responsavel_bairro').val(),
            $('#responsavel_cidade').val(),
            $('#responsavel_uf').val(),
            $('#menor_nome').val(),
            $('#menor_cpf').val(),
            $('#destino').val(),
            $('#data_inicio').val(),
            $('#data_fim').val(),
            $('#acompanhante_nome').val(),
            $('#acompanhante_rg').val(),
            $('#acompanhante_cpf').val(),
            $('#checkbox_termos').is(':checked') // Verifica se o checkbox foi marcado
        ];

        return camposObrigatorios.every(campo => campo !== "" && campo !== false);
    }

    // Ao clicar no botão de gerar PDF
    $('#gerarPDF').click(function () {
        if (!validarCampos()) {
            alert('Por favor, preencha todos os campos obrigatórios antes de gerar o PDF.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Coletando os dados dos campos do formulário
        const responsavelNome = $('#responsavel_nome').val();
        const responsavelNacionalidade = $('#responsavel_nacionalidade').val();
        const responsavelRG = $('#responsavel_rg').val();
        const responsavelCPF = $('#responsavel_cpf').val();
        const responsavelEndereco = $('#responsavel_endereco').val();
        const responsavelNumero = $('#responsavel_numero').val();
        const responsavelBairro = $('#responsavel_bairro').val();
        const responsavelCidade = $('#responsavel_cidade').val();
        const responsavelUF = $('#responsavel_uf').val();
        const menorNome = $('#menor_nome').val();
        const menorCPF = $('#menor_cpf').val();
        const destino = $('#destino').val();
        const dataInicioISO = $('#data_inicio').val();
        const dataFimISO = $('#data_fim').val();
        const dataInicio = formatarData(dataInicioISO);
        const dataFim = formatarData(dataFimISO);
        const acompanhanteNome = $('#acompanhante_nome').val();
        const acompanhanteRG = $('#acompanhante_rg').val();
        const acompanhanteCPF = $('#acompanhante_cpf').val();

        const margemEsquerda = 10;
        const larguraTexto = 190;
        let y = 40;

        doc.setFontSize(12);
        doc.text('AUTORIZAÇÃO DE VIAGEM PARA MENOR ACOMPANHADO', 105, 20, null, null, 'center');

        const textoCorpo = `Eu, ${responsavelNome}, nacionalidade ${responsavelNacionalidade}, portador(a) do RG ${responsavelRG} e CPF ${responsavelCPF}, residente e domiciliado(a) na rua/av. ${responsavelEndereco}, nº ${responsavelNumero}, no bairro ${responsavelBairro}, cidade ${responsavelCidade}/${responsavelUF}, autorizo meu filho(a) ${menorNome}, portador(a) do CPF ${menorCPF}, a viajar para ${destino}, no período de ${dataInicio} a ${dataFim}, acompanhado(a) de ${acompanhanteNome}, portador(a) do RG ${acompanhanteRG} e CPF ${acompanhanteCPF}.`;

        const linhasCorpo = doc.splitTextToSize(textoCorpo, larguraTexto);
        doc.text(linhasCorpo, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasCorpo.length * 8;

        const textoAdicional = 'Declaro, ainda, que as informações acima são verdadeiras e que estou ciente de que a falsidade dessa declaração pode implicar em sanções penais e civis.';
        const linhasAdicional = doc.splitTextToSize(textoAdicional, larguraTexto);
        doc.text(linhasAdicional, margemEsquerda, y, { maxWidth: larguraTexto, align: 'justify' });
        y += linhasAdicional.length * 8;

        doc.text('Local e data: ________________, ____, ______________, 202_.', margemEsquerda, y);
        y += 20;

        doc.text('Assinatura do Responsável:', margemEsquerda, y);
        y += 25;
        doc.text('__________________________________', margemEsquerda, y);

        doc.save('autorizacao_viagem_menor.pdf');
    });
});
