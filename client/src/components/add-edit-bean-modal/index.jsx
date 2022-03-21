import React, { useEffect, useCallback, useState, createRef } from 'react'
import { useUserData } from '../../context/AccountContext';
import { useAttributeRangeList, useInsertAttribute } from '../../context/AttributeRangeContext';
import { useBeanList, useInsertBean, useUpdateBean } from '../../context/BeansContext';
import { unescapeHtml } from '../../utils/HtmlConverter'
import './modals.scss'
import AddEditBeanModalContainer from './components/AddEditBeanModalContainer';
import StepsTab from './components/StepsTab';
import FormInput from '../elements/FormInput';
import FormRadio from '../elements/FormRadio';
import FormMultiSelect from '../elements/FormMultiSelect';
import RedOutlineButton from '../elements/RedOutlineButton';
import BlueButton from '../elements/BlueButton';
import InputConfirmSection from './components/InputConfirmSection';
import MultiselectConfirmSection from './components/MultiselectConfirmSection';
import PencilAltIconButton from '../elements/PencilAltIconButton';
import FormBlendRatioInput from './components/FormBlendRatioInput';
import AddEditNameInput from './components/AddEditNameInput';
import AddEditGradeInput from './components/AddEditGradeInput';
import AddEditRoastLevelInput from './components/AddEditRoastLevelInput';
import AddEditHarvestPeriodInput from './components/AddEditHarvestPeriodInput';
import AddEditAltitudeInput from './components/AddEditAltitudeInput';
import AddEditMemoTextarea from './components/AddEditMemoTextarea';


const AddEditBeanModal = ({setModal, targetBean, mode = 'add'}) => {
  const userData = useUserData()
  const attributeRangeList = useAttributeRangeList() 
  const insertAttribute = useInsertAttribute()
  const beanList = useBeanList()
  const insertBean = useInsertBean()
  const updateBean = useUpdateBean();

  const [bean, setBean] = useState({
    single_origin: true,
    label: null,
    grade: null,
    roast_level: null,
    roast_date: null,
    harvest_period: null,
    altitude: null,
    memo: null,
    blend_ratio: {},
    origin: [],
    farm: [],
    variety: [],
    process: [],
    roaster: [],
    aroma: []
  })

  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedRoaster, setSelectedRoaster] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedAroma, setSelectedAroma] = useState([]);
  const [selectedVariety, setSelectedVariety] = useState([]);
  const [selectedBlendBeans, innerSetSelectedBlendBeans] = useState([]);
  const [blendRatios, innerSetBlendRatio] = useState({});
  const [blendRatioHtmlDict, setBlendRatioHtmlDict] = useState({})

  const setSelectedBlendBeans = (e) => {
    innerSetSelectedBlendBeans(e);
    // If parameter e contains the newly selected BlendBean,
    // it must be found and set it in the blendRatio with the value of zero
    e.forEach(bean => {
      let found = false;
      for (const beanId of Object.keys(blendRatios)) {
        if (bean.value === beanId) found = true;
      }
      if (!found) {
        setBlendRatio(bean.value, '0');
      }
    })
  }
  
  const setBlendRatio = (key, value) => {
    const newRatio = {};
    newRatio[key] = value;
    innerSetBlendRatio(blendRatios => (
      { ...blendRatios, ...newRatio }
    ));
  }

  const [tabState, setTabState] = useState({
    baseInfoTab: true,
    detailsTab: false,
    confirmationTab: false,
    canGoToConfirmation: false
  });

  const baseInfoPage = createRef(null);
  const detailsPage = createRef(null);
  const confirmationPage = createRef(null);

  const showPage = (pageRef) => {
    pageRef.current.style.opacity = 1;
    pageRef.current.style.height = "auto";
    pageRef.current.style.overflow = "visible";
  }

  const hidePage = (pageRef) => {
    pageRef.current.style.opacity = 0;
    pageRef.current.style.height = 0;
    pageRef.current.style.overflow = "hidden";
  }

  // To toggle click from the Next button
  const setOpenBaseInfoTab = () => {
    showPage(baseInfoPage);
    hidePage(detailsPage);
    hidePage(confirmationPage);
    setTabState({...tabState, baseInfoTab: true, detailsTab: false, confirmationTab: false});
 } 

  const setOpenDetailsTab = () => {
    hidePage(baseInfoPage);
    showPage(detailsPage);
    hidePage(confirmationPage);
    setTabState({...tabState, baseInfoTab: false, detailsTab: true, confirmationTab: false});
  }

  const setOpenConfirmationTab = () => {
    hidePage(baseInfoPage);
    hidePage(detailsPage);
    showPage(confirmationPage);
    setTabState({...tabState, baseInfoTab: false, detailsTab: false, confirmationTab: true});
  }

  const checkCanGoToConfirmation = useCallback(() => {
    if (bean.single_origin && selectedOrigin !== null) {
      setTabState({...tabState, canGoToConfirmation: true});
    }
    else if (!bean.single_origin && selectedBlendBeans !== null) {
      setTabState({...tabState, canGoToConfirmation: true});
    }
    else {
      setTabState({...tabState, canGoToConfirmation: false});
    }
  }, [bean.single_origin, selectedBlendBeans, selectedOrigin]);


  const makeIdList = (selectedRange, category) => {
    const idList = [];
    try {      
      selectedRange.forEach(range => {
        for (const entry of Object.values(attributeRangeList[category + '_range'])) {
          if (unescapeHtml(entry['label']) === range['label']) {
            idList.push(parseInt(entry['value']));
          }
        }
      })
    } catch { }
    return idList;
  }

  const makeSelectedRangeList = (idList, category) => {
    const selectedRangeList = [];
    for (const entry of Object.values(attributeRangeList[category + '_range'])) {
      const id = parseInt(entry['value'])
      if (idList.includes(id)) {
        selectedRangeList.push(entry);
      }
    }
    return selectedRangeList;
  }

  const finalizeBean = () => {
    const roasterIdList = makeIdList(selectedRoaster, "roaster");
    const aromaIdList = makeIdList(selectedAroma, "aroma");
    if (bean.single_origin) {
      const originIdList = makeIdList(selectedOrigin, "origin");
      const farmIdList = makeIdList(selectedFarm, "farm");
      const varietyIdList = makeIdList(selectedVariety, "variety");
      const processIdList = makeIdList(selectedProcess, "process");
      
      setBean({...bean, 
        roaster: [...roasterIdList],
        aroma: [...aromaIdList],
        origin: [...originIdList],
        farm: [...farmIdList],
        variety: [...varietyIdList],
        process: [...processIdList],
      });
    } else {
      setBean({...bean, 
        roaster: [...roasterIdList],
        aroma: [...aromaIdList],
        blend_ratio: blendRatios,
      });
    }
  }

  const getNewRangeList = (selectedRange) => {
    try {      
      let newRangeList = selectedRange.filter((x) => "__isNew__" in x);
      return newRangeList;
    } catch {}
    return []
  }

  const insertNewRangeList = async () => {
    let newRangeList = {
      'origin': getNewRangeList(selectedOrigin),
      'roaster': getNewRangeList(selectedRoaster),
      'farm': getNewRangeList(selectedFarm),
      'process': getNewRangeList(selectedProcess),
      'aroma': getNewRangeList(selectedAroma),
      'variety': getNewRangeList(selectedVariety)
    }

    for (const [category, entries] of Object.entries(newRangeList)) {
      for await (const entry of entries) {
        const body = { "label": entry.label, "def": "" };
        await insertAttribute(userData.sub, category, body);
      }
    }
  }

  const [processAddSubmit, setProcessAddSubmit] = useState(false);
  const [processEditSubmit, setProcessEditSubmit] = useState(false);

  const onSubmit = () => {
    finalizeBean();
    if (mode === 'add') {
      setProcessAddSubmit(true);
    }
    else if (mode === 'edit') {
      setProcessEditSubmit(true);
    }
  }

  useEffect(async () => {
    if (processAddSubmit && bean.label !== null) {
      const insertSuccess = await insertBean(userData.sub, bean);
      if (insertSuccess)
        setModal({mode: '', isOpen: false});
    }
  }, [processAddSubmit])

  useEffect(async () => {
    if (processEditSubmit && bean.label !== null) {
      const updateSuccess = await updateBean(userData.sub, targetBean['coffee_bean_id'], bean);
      if (updateSuccess)
        setModal({mode: '', isOpen: false});
    }
  }, [processEditSubmit])

  // To enable/disable Next button to go to confirmation section
  useEffect(() => {
    checkCanGoToConfirmation();
  }, [bean.single_origin, selectedOrigin, selectedBlendBeans]);


  // To delete unselected BlendBean from the blendRatios object
  useEffect(() => {
    if (Object.keys(blendRatios).length > 0) {
      for (const beanId of Object.keys(blendRatios)) {
        let found = false;
        selectedBlendBeans.forEach(selectedBean => {
          if (selectedBean.value === beanId) found = true;
        });
        if (!found) {
          delete blendRatios[beanId]
          delete blendRatioHtmlDict[beanId]
        }
      }
    }
  }, [selectedBlendBeans, blendRatios]);

  useEffect(() => {
    if (mode === 'edit') {
      setBean({...bean,
        single_origin: targetBean['single_origin'],
        label: targetBean['label'],
        grade: targetBean['grade'],
        roast_level: targetBean['roast_level'],
        roast_date: targetBean['roast_date'] ? targetBean['roast_date'].split('T')[0] : undefined,
        harvest_period: targetBean['harvest_period'],
        altitude: targetBean['altitude'],
        memo: targetBean['memo'],
      })
      setSelectedRoaster(makeSelectedRangeList(targetBean['roaster'], 'roaster'))
      setSelectedOrigin(makeSelectedRangeList(targetBean['origin'], 'origin'))
      setSelectedFarm(makeSelectedRangeList(targetBean['farm'], 'farm'))
      setSelectedVariety(makeSelectedRangeList(targetBean['variety'], 'variety'))
      setSelectedProcess(makeSelectedRangeList(targetBean['process'], 'process'))
      setSelectedAroma(makeSelectedRangeList(targetBean['aroma'], 'aroma'))
    }
  },[])

  useEffect(() => {
    Object.keys(blendRatios).forEach(id => {
      const html = {}
      html[id] = <FormBlendRatioInput
        title={beanList[id]['label']}
        name={id}
        value={blendRatios[id]}
        onChange={e => {
          setBlendRatio(id, e.target.value);
        }}
      />
      setBlendRatioHtmlDict(blendRatioHtmlDict => ({...blendRatioHtmlDict, ...html}))
    })
  }, [blendRatios])

  useEffect(() => {
    if (mode === 'edit' && selectedBlendBeans.length === 0 && Object.keys(targetBean['blend_ratio']).length !== 0) {
      Object.keys(targetBean['blend_ratio']).forEach(id => {
        setBlendRatio(id, targetBean['blend_ratio'][id])
        innerSetSelectedBlendBeans(selectedBlendBeans => [
          ...selectedBlendBeans, 
          { 
            label:beanList[id]['label'],
            value:beanList[id]['coffee_bean_id']
          }
        ])
      })
    }
  }, [bean])

  return (

    <AddEditBeanModalContainer
      title={
        mode === 'add' ? 'Add New Coffee Bean Type' :
        mode === 'edit' ? `Edit Coffee Bean ${targetBean['label']}` : null
      }
      onCloseClick={() => setModal({mode: '', isOpen: false})}
    >
      {/*body*/}
      <ul className="flex">
          <StepsTab
            key="base-info"
            title="1. Base Info"
            tabState={tabState.baseInfoTab}
            onClick={setOpenBaseInfoTab}
          />
          <StepsTab
            key="details"
            title="2. Details"
            disabled={bean.label === '' || bean.label === null}
            tabState={tabState.detailsTab}
            onClick={setOpenDetailsTab}
          />
          <StepsTab
            key="confirmation"
            title="3. Confirmation"
            disabled={!tabState.canGoToConfirmation}
            tabState={tabState.confirmationTab}
            onClick={() =>{
              setOpenConfirmationTab();
              insertNewRangeList();
            }}
          />
      </ul>


      <form 
        className="tab-content"
      >
        <div 
          ref={baseInfoPage} 
          className="ease-linear transition-all duration-300"
        >
          <div className="md:flex md:px-8 my-8">
            <div className="flex flex-col md:w-1/2">
              <AddEditNameInput
                bean={bean}
                setBean={setBean}
              />
              <AddEditGradeInput
                bean={bean}
                setBean={setBean}
              />
              <AddEditRoastLevelInput
                bean={bean}
                setBean={setBean}             
              />
            </div>

            <div className="md:w-1/2">
              <div className="form-section h-1/3 flex items-end justify-start">
                <FormRadio
                  title="Single Origin"
                  name="single_origin"
                  checked={bean.single_origin ? true : false}
                  onChange={e => {setBean({...bean, single_origin: true})}}
                />
                <FormRadio
                  title="Blend"
                  name="single_origin"
                  checked={bean.single_origin ? false : true}
                  onChange={e => {setBean({...bean, single_origin: false})}}
                />
              </div>
              <FormMultiSelect 
                title="Roaster"
                options={Object.values(attributeRangeList.roaster_range)}
                value={selectedRoaster}
                onChange={setSelectedRoaster}
                isCreatable={true}
              />
              <FormInput
                title="Roast Date"
                type="date" 
                name="roastdate" 
                placeholder="e.g. 2021-12-10" 
                value={bean.roast_date}
                onChange={e => setBean({...bean, roast_date: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-2 md:px-8 pb-8">
            <RedOutlineButton
              text="Cancel"
              onClick={() => setModal({mode: '', isOpen: false})}
            />
            <BlueButton
              text="Next"
              disabled={
                bean.label === null || 
                bean.label.length === 0 ? true : false
              }
              onClick={setOpenDetailsTab}
            />
          </div>
        </div>

        <div 
          ref={detailsPage}
          className="overflow-hidden h-0 opacity-0 ease-linear transition-all duration-300"
        >
          <div className={`md:px-8 my-8 ${bean.single_origin ? "hidden" : "block md:flex"}`}>
            <div className="flex flex-col md:w-1/2">
              <FormMultiSelect 
                title="Blend of"
                required={true}
                options={Object.values(beanList).map(({ coffee_bean_id: value, ...rest }) => ({ value, ...rest } ))}
                value={selectedBlendBeans}
                onChange={e => setSelectedBlendBeans(e)}
              />
              <div className="form-section my-4">
                <label className="font-medium divider">Blend Ratio</label>
                <div>
                  { Object.values(blendRatioHtmlDict) }
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <FormMultiSelect 
                title="Aroma"
                options={Object.values(attributeRangeList.aroma_range)}
                value={selectedAroma}
                isCreatable={true}
                onChange={setSelectedAroma}
              />
              <AddEditMemoTextarea
                bean={bean}
                setBean={setBean}
              />
            </div>
          </div>

          <div className={`md:px-8 my-8 ${bean.single_origin ? "block md:flex" : "hidden"}`}>
            <div className="flex flex-col md:w-1/2">
              <FormMultiSelect 
                title="Origin"
                required={true}
                options={Object.values(attributeRangeList.origin_range)}
                value={selectedOrigin}
                onChange={setSelectedOrigin}
                isCreatable={true}
              />
              <FormMultiSelect 
                title="Farm"
                options={Object.values(attributeRangeList.farm_range)}
                value={selectedFarm}
                onChange={setSelectedFarm}
                isCreatable={true}
              />
              <FormMultiSelect 
                title="Variety"
                options={Object.values(attributeRangeList.variety_range)}
                value={selectedVariety}
                onChange={setSelectedVariety}
                isCreatable={true}
              />
              <AddEditHarvestPeriodInput
                bean={bean}
                setBean={setBean}
              />
              <AddEditAltitudeInput
                bean={bean}
                setBean={setBean}
              />
            </div>

            <div className="md:w-1/2">
              <FormMultiSelect 
                title="Process"
                options={Object.values(attributeRangeList.process_range)}
                value={selectedProcess}
                onChange={setSelectedProcess}
                isCreatable={true}
              />
              <FormMultiSelect 
                title="Aroma"
                options={Object.values(attributeRangeList.aroma_range)}
                value={selectedAroma}
                onChange={setSelectedAroma}
                isCreatable={true}
              />
              <AddEditMemoTextarea
                bean={bean}
                setBean={setBean}
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 md:px-8 pb-8">
            <RedOutlineButton
              text="Go Back"
              onClick={setOpenBaseInfoTab}
            />
            <BlueButton
              text="Next"
              disabled={!tabState.canGoToConfirmation}
              onClick={() => {
                setOpenConfirmationTab();
                insertNewRangeList();
              }}
            />
          </div>
        </div>

        <div 
          ref={confirmationPage}
          className="overflow-hidden h-0 opacity-0 ease-linear transition-all duration-300"
        >
            
          <div className="md:px-8 my-10">
            <div className="md:flex">
              <div className="flex flex-col w-full md:w-1/2">
                <div>
                  <div className="flex mx-4 mb-4">
                    <h3 className="text-lg">Base Info</h3>
                    <PencilAltIconButton
                      width="5"
                      onClick={setOpenBaseInfoTab}
                    />
                  </div>
                  <div className="mb-8 md:m-8">
                    <InputConfirmSection
                      title="Name"
                      content={bean.label}
                    />
                    <InputConfirmSection
                      title="Single Origin"
                      content={bean.single_origin ? 'Yes' : 'No'}
                    />
                    <InputConfirmSection
                      title="Grade (0 - 100)"
                      content={bean.grade}
                    />
                    <MultiselectConfirmSection
                      title="Roaster"
                      content={selectedRoaster}
                    />
                    <InputConfirmSection
                      title="Roast Level (0 - 10)"
                      content={bean.roast_level}
                    />
                    <InputConfirmSection
                      title="Roast Date"
                      content={bean.roast_date}
                    />
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <div className="flex mx-4 mb-4">
                  <h3 className="text-lg">Details</h3>
                  <PencilAltIconButton
                    width="5"
                    onClick={setOpenDetailsTab}
                  />
                </div>
                <div className="mb-8 md:m-8">
                  { bean.single_origin ? 
                    <>
                      <MultiselectConfirmSection
                        title="Origin"
                        content={selectedOrigin}
                      />
                      <MultiselectConfirmSection
                        title="Farm"
                        content={selectedFarm}
                      />
                      <MultiselectConfirmSection
                        title="Variety"
                        content={selectedVariety}
                      />
                      <InputConfirmSection
                        title="Harvest Period"
                        content={bean.harvest_period}
                      />
                      <InputConfirmSection
                        title="Altitude"
                        content={bean.altitude}
                      />
                      <MultiselectConfirmSection
                        title="Process"
                        content={selectedProcess}
                      />
                      <MultiselectConfirmSection
                        title="Aroma"
                        content={selectedAroma}
                      />
                    </>
                    : 
                    // Blend Beans
                    <>
                      <MultiselectConfirmSection
                        title="Aroma"
                        content={selectedAroma}
                      />
                    <div className="confirm-section">
                      <label className=" mr-4">Blend Ratio</label>
                      <div className="tag-section font-medium">
                      {selectedBlendBeans !== null ? selectedBlendBeans.map((entry) => (
                        <span className="text-xs">{entry.label}: {blendRatios[entry.value]}%</span>
                      )): null}
                      </div>
                    </div>
                    </>
                  }
                </div>
              </div>
            </div>

            <div>
              <div className="mx-4 md:mx-6 my-2">
                <div className="w-full flex items-center">
                  <h3 className="inline">Memo</h3>
                  <PencilAltIconButton
                    width="5"
                    onClick={setOpenDetailsTab}
                  />
                  :
                  <p className="inline ml-8">{bean.memo ? bean.memo : 'Not Entered'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 md:px-8 py-8">
            <RedOutlineButton
              text="Go Back"
              onClick={setOpenDetailsTab}
            />
            <BlueButton
              text="Submit"
              disabled={!tabState.canGoToConfirmation}
              onClick={onSubmit}
            />
          </div>
        </div>
      </form>
    </AddEditBeanModalContainer>
  )
}

export default AddEditBeanModal
