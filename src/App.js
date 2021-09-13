import './App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/planilha-de-ligacoes.png';
import logoHeader from './assets/BellaDonaLogo.png';

function App() {

  const baseUrl = "https://localhost:44311/api/pessoas";
  const [data, setData] = useState([]);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [updateData, setUpdateData] = useState(true);



  const [cadastroSelecionado, setCadastroSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    cpfcnpj: '',
    celular: ''
  });

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setCadastroSelecionado({
      ...cadastroSelecionado, [name]: value
    });
    console.log(cadastroSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + cadastroSelecionado.id, cadastroSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(cadastro => {
          if (cadastro.id === cadastroSelecionado.id) {
            cadastro.nome = resposta.nome;
            cadastro.celular = resposta.celular;
            cadastro.email = resposta.email;
            cadastro.cpfcnpj = resposta.cpfcnpj;
            cadastro.dataNascimento = resposta.dataNascimento;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar()
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    delete cadastroSelecionado.id;
    await axios.post(baseUrl, cadastroSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + cadastroSelecionado.id)
      .then(response => {
        setData(data.filter(cadastro => cadastro.id !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      })
      .catch(error => {
        alert(error.response.data);
        console.log(error);
      })
  }

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  const selecionarCadastro = (cadastro, opcao) => {
    setCadastroSelecionado(cadastro);
    (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();

  }

  function dataAtualFormatada(data) {
    var dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano = data.getFullYear();
    return ano + "-" + mes + "-" + dia;
  }

  return (
    <div className="cadastro-container">
      <div className="logoBellaDonna">
        <img src={logoHeader} alt='LogoBellaDonna' />
        <br />
        <h3>Cadastro de Clientes</h3>
      </div>
      <header>
        <img src={logoCadastro} alt='Cadastro' width="50px" />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Novo</button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Documento</th>
            <th>Data Nascimento</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(cadastro => (
            <tr key={cadastro.id}>
              <td>{cadastro.nome}</td>
              <td>{cadastro.celularFormat}</td>
              <td>{cadastro.email}</td>
              <td>{cadastro.cpfcnpj}</td>
              <td>{cadastro.dataNascimentoFormat}</td>
              <td>
                <button className="btn btn-primary" onClick={() => selecionarCadastro(cadastro, "Editar")}>Editar</button> {" "}
                <button className="btn btn-danger" onClick={() => selecionarCadastro(cadastro, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Cadastro</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type="email" className="form-control" name="email" onChange={handleChange} />
            <br />
            <label>CPF: </label>
            <br />
            <input type="text" className="form-control" name="cpfcnpj" onChange={handleChange} />
            <br />
            <label>Celular: </label>
            <br />
            <input type="text" className="form-control" name="celular" onChange={handleChange} />
            <br />
            <label>Data de Nascimento: </label>
            <br />
            <input type="date" className="form-control" name="dataNascimento" onChange={handleChange} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cadastro</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <input type="hidden" className="form-control" readOnly value={cadastroSelecionado && cadastroSelecionado.id} />
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={cadastroSelecionado && cadastroSelecionado.nome} />
            <br />
            <label>Email: </label>
            <br />
            <input type="email" className="form-control" name="email" onChange={handleChange}
              value={cadastroSelecionado && cadastroSelecionado.email} />
            <br />
            <label>CPF: </label>
            <br />
            <input type="text" className="form-control" name="cpfcnpj" onChange={handleChange}
              value={cadastroSelecionado && cadastroSelecionado.cpfcnpj} />
            <br />
            <label>Celular: </label>
            <br />
            <input type="text" className="form-control" name="celular" onChange={handleChange}
              value={cadastroSelecionado && cadastroSelecionado.celular} />
            <br />
            <label>Data de Nascimento: </label>
            <br />
            <input type="date" className="form-control" name="dataNascimento" onChange={handleChange}
              value={cadastroSelecionado && dataAtualFormatada(new Date(cadastroSelecionado.dataNascimento))} />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalHeader>Excluir Cadastro</ModalHeader>
        <ModalBody>
          Confirma a exclusão deste(a) cliente : {cadastroSelecionado && cadastroSelecionado.nome}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()}>Sim</button>{" "}
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
