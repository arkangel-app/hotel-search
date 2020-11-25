import React, { Component } from "react";
import GoogleMaps  from './map';

import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Slider from 'antd/lib/slider';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';
import Collapse from 'antd/lib/collapse';

import foto from './images/fachada.jpg';
import marcadorIcon from './images/marker_marriott.svg';
// import marcadorIconW from './images/marker_marriott_w.svg';

import restClient from './network/restClient';

import SliderSlick from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Object } from "core-js";

const { Option } = Select;

class Finder extends React.PureComponent {


  

    state = {
      loading: false,
      inputValue: 1,
      inputValue2: 1,
      areas:[],
      brands:[],
      amenties:[],
      countries:[],
      categories:[],
      propertiesList:[],
      buscarForm:false,
      refineSearch:false,
      modal2Visible: false,
      photos: [foto,foto,foto],
      formularioPanel:"",
      hotelHover:undefined,
      hotelSelected:undefined,
      loadingGallery:false,
      hotelGallery:[],
      resultado:false
    };

    componentWillReceiveProps(nextProps){
      if (nextProps.location.state !== undefined) {
        if(nextProps.location.state.nav!=undefined){
          console.log("nav");
          if(this.props.location.state.nav!=nextProps.location.state.nav){
            this.callRestFromState(nextProps.location.state.filtro);
          }
          //
        }
        // do stuffs
      }
    }

     componentDidMount(){

        this.loadAll();
        console.log(this.props);
        if(this.props.location.state){
          if(this.props.location.state.filtro!==undefined){
            //buscar con esos filtros
            let filtro = this.props.location.state.filtro;
            this.callRestFromState(filtro);
          }else{
            this.handlerForm();
          }
        }

    }
    callRestFromState = (filtro)=>{
      this.callRestSearch(filtro);

      this.props.form.setFieldsValue({
        amenties: filtro.amenties,
        area: filtro.area,
        brand: filtro.brand,
        category: filtro.category,
        country: filtro.country,
        space: filtro.maxSpace,
        resortsOnly: filtro.resortsOnly,
        rooms: filtro.rooms
      })
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

        //  restClient.getAllProperties().then(response=>{
        //      this.setState({propertiesList:response.data.properties})
        //  });
        //this.handleSubmit();

    }



    changeEvent = value => {
      this.setState({
        inputValue: value,
      });
      
    };
    changeEventRooms = value=>{
      this.setState({
        inputValue: value,
      });
      this.props.form.setFieldsValue({
        rooms: value
      })
    }
    changeEventMeeting = value=>{
      this.setState({
        inputValue2: value,
      });
      this.props.form.setFieldsValue({
        space: value
      })
    }

     onChange2 = value => {
      this.setState({
      inputValue2: value,
      });
    };


    handlerForm = e => {
      if(e!==undefined){
        e.preventDefault();
      }
       
      this.setState({buscarForm:!this.state.buscarForm,
        formularioPanel:(this.state.buscarForm?"":"formularioPanel"), resultado:false})
    }

  handleSubmit = e => {
    if(e!=undefined){
      e.preventDefault();
    }
    
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callRestSearch(values);
      }
    });
  };

   setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  callRestSearch=(values)=>{
    this.setState({loading:true});

    Object.keys(values).map(keys=>{
      
      if(values[keys]===""){
        values[keys]=undefined;
      }
    })

    restClient.refinePropertiesList(values).then(response=>{
      response.data.properties.map(hotel=>{
         hotel.icon = marcadorIcon;
      })
      this.setState({propertiesList:response.data.properties, loading:false,buscarForm:false,formularioPanel:"",resultado:true},()=>{
        if(response.data.properties.length>0){
          
          setTimeout(()=>{
            this.mapRef.fitMarkersBound();
          },1000)
        }
      })
     }).catch(error=>{
      this.setState({propertiesList:[], loading:false})
    });
  }

popUpModal=(hotel)=>{
  const modal = Modal.info({
    content: (
      <div className="modal_data_wrapper">
        <div className="popupCloseIcon"><Icon onClick={()=>{
          modal.destroy();
          this.setState({hotelSelected: undefined})
        }} type="close-circle" theme="filled" /></div>
    <div className="headerModal">
       <h3 className="modalTit">{hotel.property}</h3>
       <p className="modalAddress">{hotel.address}</p>
       <div className="modalTags">
           <div className="oval">
                   {hotel.brand}
           </div>
           <div className="oval">
                   {hotel.area}
           </div>
           <div className="oval">
                   {hotel.country}
           </div>
          {(hotel.floors!=0 || hotel.rooms!=0 || hotel.suites!=0) &&
            <div className="oval">
              {hotel.floors!=0?`${hotel.floors} floors, `:''} 
              {hotel.rooms!=0?`${hotel.rooms} rooms, `:''} 
              {hotel.suites!=0?`${hotel.suites} suites`:''} 
            </div>
          }
          {(hotel.meeting_rooms!=0 || hotel.space!=0) &&
            <div className="oval">
              {hotel.meeting_rooms!=0?`${hotel.meeting_rooms} meeting rooms, `:''} 
              {hotel.space!=0?`${hotel.space} sq ft of total mmeting space`:''} 
            </div>
          }
       </div>
       <Row gutter={50} className="popupHotelContenido">
        <Col md={10} xs={24} type="flex" justify="space-around" align="middle">
          {this.state.loadingGallery?
            <div className="spinnerGallery">
              <Spin spinning={this.state.loadingGallery}></Spin>
            </div>:
            (this.state.hotelGallery.length>0? 
              <SliderSlick dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
                {this.state.hotelGallery.map(hotelG=>
                  <div className="itemGallery"> <img src={hotelG.photo_path} className="card-img-top"/></div>
                )}
              </SliderSlick>:""
            )
          }
          
        </Col>
        <Col md={14} xs={24}>
          <div className="descriptionTitle">
                {hotel.description_title}
          </div>
          <div className="descriptionModal">
                {hotel.description}
          </div>
          <div className="webButonModal">
            <a className="modalBtn" href={hotel.link} target="_blank">
                    Visit Website
            </a>
          </div> 
        </Col>
       </Row>
    </div>
      </div>
    ),
    width:"75%",
    centered:true,
    maskClosable:true,
    onCancel:()=>{
      this.setState({hotelSelected: undefined})
    }
  });
}  

DataModal(hotel) {
  this.setState({hotelSelected: hotel, loadingGallery:true},()=>{
    restClient.getGalleryHotel({marsha:hotel.marsha}).then(response=>{
      response.gallery.map(foto=>{
        foto.key = `${foto.photo_path}`
      })
      this.setState({loadingGallery:false,hotelGallery:response.gallery},()=>{
        this.popUpModal(hotel)
      });
      
    }).catch(error=>{
      this.setState({loadingGallery:false},()=>{
        this.popUpModal(hotel)
      });
      
    })
  });
}
  hotelMouseOver=(hotel)=>{
    this.setState({hotelHover: hotel})
  }
  hoteloMouseOut=()=>{
    this.setState({hotelHover: undefined})
  }

  setMapRef=(ref)=>{
    this.mapRef = ref;
  }



  render() {
    
      const { getFieldDecorator } = this.props.form;
      const { inputValue,inputValue2 } = this.state;
      const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
      const marks = {
        1: '1',
        1500:  '1500',
      };
      const marks2 = {
        1: '1',
        70500:  '70500',
      };

    return (
      
      <div>
          <Row>
            <Col xs={24} md={12}>
              <div className="containerPanelBox">
                <Row className=" finderTitles">
                    <Col xs={12} className="titleLeft">
                        <div className="bigTitle">Results {this.state.loading && <Icon type="loading" />}</div>
                    </Col>
                    <Col xs={12}  className="titleRight">
                      <div className="btnBox">
                        <a className="filtersBtn" href="#" onClick={this.handlerForm}>Refine Search</a>
                      </div>
                    </Col>
                </Row>
                <Collapse className="collapseFormulario" bordered={false} expandIconPosition="right" activeKey={this.state.formularioPanel}>
                  <Collapse.Panel key="formularioPanel">
                    <div className="contanier finderForm" id="refineSearch">
                      <Form onSubmit={this.handleSubmit}>
                        <Row gutter={40}>
                          <Col xs={24} md={12}>
                              <Form.Item className="findItem" label="Brand">
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
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item className="findItem" label="Region">
                                  {getFieldDecorator('area',)(
                                    <Select className=""
                                  onChange={this.handleSelectChange}>
                                    <Option key={`area-vacio`} value="">All</Option>
                                  {this.state.areas.map(area=>
                                        <Option key={`area-${area.id_area}`} value={area.id_area} >{area.name}</Option>
                                  )}
                                  </Select>
                                  )}
                              </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item className="findItem" label="Country">
                                {getFieldDecorator('country',)(
                                  <Select className=""
                                onChange={this.handleSelectChange}>
                                  <Option key={`country-vacio`} value="">All</Option>
                                  {this.state.countries.map(country=>
                                  <Option key={`${country.id_country}`} value={country.id_country} >{country.country}</Option>
                                  )}
                                </Select>
                                )}
                              </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item className="findItem" label="Category">
                                {getFieldDecorator('category',)(
                                  <Select className=""
                                onChange={this.handleSelectChange}>
                                  <Option key={`category-vacio`} value="">All</Option>
                                {this.state.categories.map(category=>
                                <Option key={`category-${category.id_category}`} value={category.id_category} >{category.name}</Option>
                                )}
                                </Select>
                                )}
                              </Form.Item>
                          </Col>
                          <Col xs={12}>
                            <Form.Item >
                                {getFieldDecorator('resortsOnly',)(
                                  <Checkbox className="resorts">
                                    Resorts Only
                                  </Checkbox>
                                )}
                              </Form.Item>
                          </Col>
                          <Col xs={12}>
                            <Form.Item>
                              {getFieldDecorator('core',)(
                                <Checkbox className="resorts">
                                  Core
                                </Checkbox>
                              )}
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <div className="row">
                                <div className="labelTxt">Total Guest Rooms:</div>
                                <div className="col-md-8">
                                <Form.Item>
                                {getFieldDecorator('rooms',{
                                  initValue:1,
                                } )(
                                  <Slider
                                  min={1}
                                  max={1500}
                                  step={20}
                                  onChange={this.changeEvent}
                                  marks={marks} included={false} />,
                                )}
                                </Form.Item>
                                </div>
                                <div className="col-md-4 imputCol">
                                <InputNumber
                                  min={1}
                                  max={1500}
                                  
                                  value={inputValue}
                                  onChange={this.changeEventRooms}
                                  className="meetingInput"/>
                                </div>
                              </div>
                          </Col>
                          <Col xs={24} md={12}>
                            <div className="row">
                                <div className="labelTxt">Total Meeting Space:</div>
                                <div className="col-md-8">
                                <Form.Item>
                                {getFieldDecorator('space',{
                                  initValue:1
                                })(
                                  <Slider
                                  min={1}
                                  max={70500}
                                  step={200}
                                  onChange={this.onChange2}
                                  marks={marks2} included={false} />,
                                )}
                                </Form.Item>
                                </div>
                                <div className="col-md-4 imputCol">
                                  <InputNumber
                                  min={1}
                                  max={70500}
                                  value={inputValue2}
                                  onChange={this.onChange2}
                                  className="meetingInput"/>
                                </div>
                              </div>
                          </Col>
                        </Row>
                        <Row type="flex" justify="center" className="parametrosBusqueda">

                            <Form.Item className="">
                              {getFieldDecorator('amenties',)(
                              <Checkbox.Group style={{ width: '100%' }}>
                                {this.state.amenties.map(amenty=>
                                  <Col key={`parametro-${amenty.id_parameters}`} xs={8} md={6}>
                                  <Checkbox value={amenty.id_parameters} key={`check-${amenty.id_parameters}`} className="checkItem">
                                          {amenty.parameter}
                                  </Checkbox>
                                  </Col>
                                  )}
                                </Checkbox.Group>,
                              )}
                              </Form.Item>

                        </Row>
                      <div className="btnBoxFrm">
                          <Button loading={this.state.loading}
                          className="btn btn-lg findBtn" htmlType="submit" size="large">Search</Button>
                      </div>
                      </Form>
                      </div>

                  </Collapse.Panel>
                </Collapse>
                {/* {this.state.buscarForm &&
                <Collapse bordered={false} activeKey={this.state.formularioPanel}>
                  <Collapse.Panel key="formularioPanel">prueba</Collapse.Panel>
                </Collapse>
                
                } */}

                {this.state.resultado && this.state.propertiesList.length===0 &&
                  <div className="noHayResultados">
                      <h2>No search results</h2>
                  </div>
                }
                <Row type="flex" gutter={23} className="rowCards" >
                {this.state.propertiesList.map((property,indice)=>
                  <Col key={`hotel-${property.id_properties}-${indice}`} md={12} xs={24} className="cardCol">
                  <a onClick={() => this.DataModal(property)}>
                    <div className="card cardHotel" onMouseOver={()=>this.hotelMouseOver(property)} onMouseOut={()=>this.hoteloMouseOut()}>
                      
                      <img src={property.photo_path} className="card-img-top"/>
                      <div className="card-body" style={{position:'relative'}}>
                        {this.state.hotelSelected===property && this.state.loadingGallery &&
                          <div className="loadingCornerCard"><Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} size="small" spinning={true}/></div>
                        }
                        <div className="post_category">
                                {property.categoria}
                        </div>
                        <h5 className="card-title">{property.property}</h5>
                        <p className="card-text">{property.address}</p>
                      </div>
                      <div className="listing_review_info">
                          <p className="listing_map_m"><Icon type="environment" theme="filled" /> {property.country}</p>
                      </div>
                    </div>
                  </a>
                  </Col>
                )}
                </Row>


              </div>
            </Col>
            <Col xs={24} md={12}>
                {/* <GoogleMaps/> */}
                <div className="mapBox">
                  <GoogleMaps 
                    ref={this.setMapRef}
                    propertiesList={this.state.propertiesList} 
                    // hotelHover={this.state.hotelHover}
                    hotelSelected={this.state.hotelSelected}/>
                </div>
            </Col>

          </Row>
          <footer className="container-footer">
              <div className="copy">© Copyright - Marriott International</div>
         </footer>
      </div>
    );
  }
}

const WrappedFiderForm = Form.create({ name: 'finder_form' })(Finder);
export default WrappedFiderForm;
