import React, { Component } from "react";
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Alert from 'antd/lib/alert';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';

import restClient from './network/restClient';
import Footer from "./Footer";
import {
  Redirect
} from "react-router-dom";
const {Option} = Select;

class Home extends Component {

  constructor(props) {
  super(props);



    this.state = {
      loading: false,
      error:undefined,
      areas:[],
      brands:[],
      countries:[],
      categories:[],
      amenties:[],
      propertiesList:[],
      guestRoomsRange:[],
      meetingSpaceRange:[],
      openMap:false,
      filtroBusqueda:undefined,
      errorSeleccion:undefined
    }

  }

  componentDidMount(){
        this.loadAll();
  }

  handleSelectChange = (value) => {
  console.log(value);
  this.props.form.setFieldsValue({
    note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
  });
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading:true,errorSeleccion:undefined})
    this.props.form.validateFields((err, values) => {
    if (!err) {
      let keys = Object.keys(values);
      let cumple = false;
      keys.map(key=>{
        if(values[key]!==undefined) cumple = true;
      })
      this.setState({loading:false, filtroBusqueda:(cumple?values:undefined), errorSeleccion:(cumple?undefined:"You must select at least one search filter")});
      //  restClient.getPropertiesList(values).then(response=>{
      //    this.setState({propertiesList:response.data.hoteles, loading:false, openMap:true})
      //  });
    }
  });
  }

  loadAll = () =>{
      restClient.getAreas().then(response=>{
        this.setState({areas:response.data.areas})
      });

      restClient.getBrands().then(response=>{
        this.setState({brands:response.data.brands})
      });

      restClient.getCategories().then(response=>{
          this.setState({categories:response.data.categories})
      });

       restClient.getCountries().then(response=>{
           this.setState({countries:response.data.countries})
       });

       restClient.getParameters().then(response=>{
           this.setState({amenties:response.data.parameters})
       });

       restClient.getRoomRanges().then(response=>{
               this.setState({guestRoomsRange:response.data.ranges})

       });

       restClient.getSpaceRanges().then(response=>{
           this.setState({meetingSpaceRange:response.data.ranges})
         });
  }

  render() {
     const { getFieldDecorator } = this.props.form;

    if (this.state.filtroBusqueda!=undefined) {
        return <Redirect to={{
          pathname: '/finder',
          state: { filtro: this.state.filtroBusqueda }
        }}/>;
    }


    return (
   <div>
    <div>
    <div className="home py-5">
    <div className="container-fluid">
      <div className="tit pt-1">
          <h2 className="titulo">MARRIOTT INTERNATIONAL</h2>
          <h1 className="titulo">CALA PROPERTY LISTING</h1>
      </div>
      <div className="container py-4 homeForm">
        <div className="caja-form py-4">
          <Form onSubmit={this.handleSubmit} >
          <div className="row">
            <div className="col-md-12">
              <Form.Item
                  label="Search by Brand, Destination, Country, State or City:"
                >
                  {getFieldDecorator('firstSearch',)(
                    <Input className="inp"/>
                  )}
              </Form.Item>
           </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p className="formText">Advanced Search:</p>
           </div>
            <div className="col-md-3">
              <Form.Item
                        label="Brand"
                      >
                        {getFieldDecorator('brand',)(
                          <Select
                            onChange={this.handleSelectChange}
                          >
                            <Option key={`brand-vacio`} value="">All</Option>
                              {this.state.brands.map(brand=>
                              <Option key={`brand-${brand.id_brand}`} value={brand.id_brand}>{brand.name}</Option>
                            )}
                          </Select>
                        )}
                      </Form.Item>

             </div>
             <div className="col-md-3">
               <Form.Item
                      label="Area:"
                    >
                      {getFieldDecorator('area',)(
                        <Select className=""
                      onChange={this.handleSelectChange}>
                        <Option key={`area-vacio`} value="">All</Option>
                      {this.state.areas.map(area=>
                            <Option key={`area-${area.id_area}`} value={area.id_area}>{area.name}</Option>
                      )}
                      </Select>
                      )}
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                     label="Country:"
                   >
                     {getFieldDecorator('country',)(
                       <Select className=""
                     onChange={this.handleSelectChange}>
                       <Option key={`country-vacio`} value="">All</Option>
                      {this.state.countries.map(country=>
                      <Option key={`country-${country.country}`} value={country.id_country}>{country.country}</Option>
                      )}
                     </Select>
                     )}
             </Form.Item>
           </div>
           <div className="col-md-3">
             <Form.Item
                    label="Category"
                  >
                    {getFieldDecorator('category',)(
                      <Select className=""
                    onChange={this.handleSelectChange}>
                      <Option key={`category-vacio`} value="">All</Option>
                    {this.state.categories.map(category=>
                    <Option key={`category-${category.category}`} value={category.id_category}>{category.name}</Option>
                    )}
                    </Select>
                    )}
            </Form.Item>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <Form.Item
                     label="Total Guest Rooms"
                   >
                     {getFieldDecorator('rooms',)(
                       <Select className=""
                     onChange={this.handleSelectChange}>
                     {this.state.guestRoomsRange.map(range=>
                     <Option key={`range-${range.id_room_range}`} value={range.id_room_range}>{range.label}</Option>
                     )}
                     </Select>
                     )}
             </Form.Item>
             </div>
             <div className="col-md-3">
               <Form.Item
                      label="Total Meeting Space (Sq ft)"
                    >
                      {getFieldDecorator('space',)(
                      <Select className=""
                      onChange={this.handleSelectChange}>
                      {this.state.meetingSpaceRange.map(range=>
                      <Option key={`range-${range.id_meeting_space_range}`} value={range.id_meeting_space_range}>{range.label}</Option>
                      )}
                      </Select>
                      )}
              </Form.Item>
            </div>
            <div className="col-md-3 lblTxt">
              <Form.Item
                     label="Maximum Meeting Space Sq ft."
                   >
                     {getFieldDecorator('maxSpace',)(
                       <Input type="number" className="maxN"/>
                     )}
             </Form.Item>
           </div>
           <div className="col-md-3">
             <Form.Item className="check" style={{marginTop:12}}>
              {getFieldDecorator('resortsOnly',)(
                 <Checkbox>
                   Resorts Only
                 </Checkbox>
               )}
             </Form.Item>
             <Form.Item className="check">
              {getFieldDecorator('core',)(
                 <Checkbox>
                   Core
                 </Checkbox>
               )}
             </Form.Item>
            </div>
          </div>
         <div>
                 <p className="formText">Amenties</p>
         </div>
        <Row type="flex" justify="center" className="parametrosBusquedaHOme">

            <Form.Item className="">
              {getFieldDecorator('amenties',)(
               <Checkbox.Group style={{ width: '100%' }}>
                {this.state.amenties.map(amenty=>
                  <Col key={`parametro-${amenty.id_parameters}`} xs={12} md={6}>
                   <Checkbox value={amenty.id_parameters} key={`check-${amenty.id_parameters}`} className="checkItemHome">
                           {amenty.parameter}
                   </Checkbox>
                   </Col>
                  )}
                 </Checkbox.Group>,
              )}
              </Form.Item>

        </Row>
          {this.state.errorSeleccion && <div><Alert message={this.state.errorSeleccion} type="warning" /></div> }
          <div className="row pb-3">
          <Button loading={this.state.loading}
            className="btn btn-lg" htmlType="submit" size="large">Continue</Button>
          </div>
        </Form>
        </div>
      </div>
  </div>

      </div>
      <div className="logosRow pt-4">
        <div className="contentWrapper pt-3 px-2">
          <img src="https://marriott-public.s3.amazonaws.com/bonvoy.png"/>
        </div>
      </div>
    </div>
<Footer/>
</div>
    );
  }
}


const WrappedHomeForm = Form.create({ name: 'home_form' })(Home);
export default WrappedHomeForm;
