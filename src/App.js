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

  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    cpfcnpj: '',
    celular: ''
  });

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado, [name]: value
    });
    console.log(clienteSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    delete clienteSelecionado.id;
    await axios.post(baseUrl, clienteSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    pedidoGet();
  });

  return (
    <div className="aluno-container">
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
          {data.map(pessoa => (
            <tr key={pessoa.id}>
              <td>{pessoa.nome}</td>
              <td>{pessoa.celularFormat}</td>
              <td>{pessoa.email}</td>
              <td>{pessoa.cpfcnpj}</td>
              <td>{pessoa.dataNascimentoFormat}</td>
              <td>
                <button className="btn btn-primary">Editar</button> {" "}
                <button className="btn btn-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Cliente</ModalHeader>
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
            <input type="text" className="form-control" name="celularFormat" onChange={handleChange} />
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

    </div>
  );
}

export default App;
