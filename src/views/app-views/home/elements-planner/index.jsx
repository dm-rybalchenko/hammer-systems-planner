import React from 'react'
import { Tabs, Button, Row, Col } from 'antd';
import Flex from 'components/shared-components/Flex';
import elementsPlanner from './elementsPlanner';


const { TabPane } = Tabs;
const styleBox = {background: "#FFF", padding: "24px", border: "1px solid #edf2f9", borderRadius: "0.625rem", marginBottom: "24px"};



class CreateTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			arrangement: [],
			chosenItem: null
		}
		this.chooseElement = this.chooseElement.bind(this);
		this.addElementToPlanner = this.addElementToPlanner.bind(this);
	}
	
	
	chooseElement(event) {
		const clickElem = event.target;
		const chosenItem = this.state.chosenItem;

		if (chosenItem){
			const elem = document.querySelector("div.ant-alert-info.ant-alert");

			elem.classList.remove('ant-alert', 'ant-alert-info');
			this.setState({chosenItem: null});
		}
		
		if(clickElem.closest(".planner__item")){
			const title = clickElem.classList.contains('planner__item') ? clickElem.lastElementChild : clickElem.parentNode.lastElementChild;
			const name = title.attributes.name.nodeValue;
			const chosenItem = elementsPlanner.find(item => item.name === name);

			title.parentNode.classList.add('ant-alert', 'ant-alert-info');
			this.setState({chosenItem: chosenItem});
		} 
	}
	
	addElementToPlanner(){
		if (this.state.chosenItem){
			this.state.chosenItem.id = Math.random();
			this.setState({arrangement: [...this.state.arrangement, this.state.chosenItem]})
		}
	}

	getElementsPlanner() {
		return elementsPlanner.map(elem => {
			return (
				<img id={elem.id}
					style={{}}
					src={"/img/planner" + elem.cover}
					alt={elem.name}
				/>
			)
		})
	}

	renderArrangement(elements){
		return elements.map(elem => {
			return (
				<div>
				<img src={"/img/planner" + elem.cover} alt={elem.name}/>
				<p name={elem.name}>{elem.title}</p>
				</div>
			)
		})
	}
	
	
	render() {
		return (
			<div>
				<div style={styleBox} onClick={this.chooseElement}>
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
				<div style={styleBox}>
					<Row>
					  <Col span={8} style={{paddingRight: "24px"}}>
						<Button type="primary" block onClick={this.addElementToPlanner}>Добавить элемент</Button>
					  </Col>
					  <Col span={8} style={{padding: "0 24px"}}>
						<Button danger block>Удалить все</Button>
					  </Col>
					  <Col span={8} style={{paddingLeft: "24px"}}>
						<Button block>Удалить элемент</Button>
					  </Col>
					</Row>
				</div>
				<div style={styleBox}>
					<div style={{width: "500px", height: "500px", background: "#424242"}}>
							{this.renderArrangement(this.state.arrangement)}
					</div>
				</div>
			</div>
		)
	}
}

export { CreateTable }