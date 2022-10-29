import React from 'react'
import { Tabs, Button, Row, Col, Input } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import elementsPlanner from './elementsPlanner';


const { TabPane } = Tabs;

class CreateTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arrangement: [],
			chosenItem: null,
			idElemToDrug: null,
			coordsDiff: {x: null, y: null},
		}
		this.chooseElementtoAdd = this.chooseElementtoAdd.bind(this);
		this.addElementToPlanner = this.addElementToPlanner.bind(this);
		this.deleteAllElements = this.deleteAllElements.bind(this);
		this.deleteElement = this.deleteElement.bind(this);
		this.chooseElementToDrug = this.chooseElementToDrug.bind(this);
		this.drugElement = this.drugElement.bind(this);
		this.uploadArrangement = this.uploadArrangement.bind(this);
	}

	
	
	chooseElementtoAdd(event) {
		const clickElem = event.target;
		const chosenItem = this.state.chosenItem;
		
		if (chosenItem){ this.removeHightLight() }

		if(clickElem.closest(".planner__item")){
			const title = clickElem.classList.contains('planner__item') ? clickElem.lastElementChild : clickElem.parentNode.lastElementChild;
			const name = title.attributes.name.nodeValue;
			const chosenItem = elementsPlanner.find(item => item.name === name);
			
			title.parentNode.classList.add('planner__item_selected');
			this.setState({chosenItem: chosenItem});
		}
	}
	
	addElementToPlanner(){
		this.removeHightLight();
				
		if (this.state.chosenItem !== null){
			let itemToAdd = Object.assign({}, this.state.chosenItem);
			const random = crypto.randomUUID();

			itemToAdd.id = random;
			itemToAdd.class = "planner__item-canvas";
			this.setState({arrangement: [...this.state.arrangement, itemToAdd]});
		}
	}

	removeHightLight(){
		const elem = document.querySelector(".planner__item_selected");
		elem && elem.classList.remove('planner__item_selected');
		this.setState({chosenItem: null});
	}
	
	deleteAllElements(){
		this.setState({arrangement: []})
	}

	deleteElement(){
		const elem = document.querySelector(".planner__item_selected");
		if (elem !== null) {
			const [allElems, deletedElem] = this.splitArr(this.state.arrangement, elem.id);
			this.setState({arrangement: allElems});
		}
	}
	
	getElementsPlanner() {
		return elementsPlanner.map(elem => {
			return (
				<Flex className="planner__item" alignItems="center" justifyContent="between" flexDirection="column">
					<img src={"/img/planner" + elem.cover} alt={elem.name}/>
					<p name={elem.name}>{elem.title}</p>
				</Flex>
			)
		})
	}
	
	renderArrangement(elements){
		return elements.map(elem => {
			return (
				<img id={elem.id}
					style={{top: `${elem.coordY}px`, left: `${elem.coordX}px`}}
					className={elem.class}
					src={"/img/planner" + elem.cover}
					alt={elem.name}
				/>
			)})
	}
		
	chooseElementToDrug(event){
		this.removeHightLight();
		const elem = event.target;
		
		if (event.type === "mousedown" && elem.id) {
			const coordsElem = elem.getBoundingClientRect();
			const coordsField = elem.parentNode.getBoundingClientRect();

			this.setState({
				idElemToDrug: elem.id,
				coordsDiff: {
					x: (event.clientX - coordsElem.left) + coordsField.left + window.scrollX,
					y: (event.clientY - coordsElem.top) + coordsField.top + window.scrollY,
				}
			});
			
			elem.classList.add('planner__item_selected');
			document.addEventListener("mouseup", event => {
				if (this.state.idElemToDrug !== null){
					this.setState({idElemToDrug: null, coordsDiff: {x: null, y: null}});
				}
			}, {"once": true});
		}
	}
	
	drugElement(event) {
		if (event.type === "mousemove" && this.state.idElemToDrug !== null){
			event.preventDefault();
			const [allElems, druggedElem] = this.splitArr(this.state.arrangement, this.state.idElemToDrug);

			let elemX = event.pageX - this.state.coordsDiff.x;
			let elemY = event.pageY - this.state.coordsDiff.y;
			elemX = (elemX > 500 - druggedElem.width) ? 500 - druggedElem.width : (elemX < 0) ? 0 : elemX;
			elemY = (elemY > 500 - druggedElem.height) ? 500 - druggedElem.height : (elemY < 0) ? 0 : elemY;
			druggedElem.coordX = elemX;
			druggedElem.coordY = elemY;

			this.setState({arrangement: [...allElems, druggedElem]});
			this.removeHightLight();
			event.target.classList.add('planner__item_selected');
		}
	}

	splitArr(arr, idElem){
		const allElems = arr;
		const indexElem = arr?.findIndex(item => item.id === idElem);
		const [elem] = allElems.splice(indexElem, 1);
		return [allElems, elem];
	}

	uploadArrangement(){
		const selectedFile = document.querySelector('.planner-input-file');
		const file = selectedFile.files[0];
  		const reader = new FileReader();
		reader.readAsText(file);

		reader.onload = () => {	this.setState({arrangement: JSON.parse(reader.result)}); };
	  	reader.onerror = () => { alert(reader.error); };
	}

	
	componentDidMount(){
		let arr = localStorage.getItem('plannerArrangement');
		if (arr === null) return;
		this.setState({arrangement: JSON.parse(arr)});
	}
	
	componentDidUpdate(){
		localStorage.setItem('plannerArrangement', JSON.stringify(this.state.arrangement));
	}
	

	render() {
		return (
			<div>
				<div className="planner-main-box" onClick={this.chooseElementtoAdd}>
					<Tabs defaultActiveKey="1">
						<TabPane tab="Новые столы" key="1">
							<Flex gap="30">
								  {this.getElementsPlanner()}
							</Flex>
						</TabPane>
						<TabPane tab="Места" key="2">
						  Content of Tab Pane 2
						</TabPane>
						<TabPane tab="Прочее" key="3">
						  Content of Tab Pane 3
						</TabPane>
					  </Tabs>
				</div>
				<div className="planner-main-box">
					<Row>
					  <Col span={8} className="planner__btn-add">
						<Button type="primary" block onClick={this.addElementToPlanner}>Добавить элемент</Button>
					  </Col>
					  <Col span={8} className="planner__btn-delete-all">
						<Button danger block onClick={this.deleteAllElements}>Удалить все</Button>
					  </Col>
					  <Col span={8} className="planner__btn-delete">
						<Button block onClick={this.deleteElement}>Удалить элемент</Button>
					  </Col>
					</Row>
				</div>
				<div className="planner-main-box">
					<div onMouseDown={this.chooseElementToDrug}
						onMouseMove={this.drugElement}
						className="planner__container">
							{this.renderArrangement(this.state.arrangement)}
					</div>
				</div>
				<div className="planner-main-box">
					<Row>
						<Col>
    						<Input className='planner-input-file' type='file' size="small"/>
							<br/>
							<Button onClick={this.uploadArrangement} icon={<UploadOutlined />}>Загрузить выбранный файл</Button>
						</Col>
						<Col>
		    				<Button
								href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.arrangement))}
								download="arrangement-restaurant.json"
								icon={<DownloadOutlined />}
							>Скачать файл тукущего расположения</Button>
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}

export { CreateTable }