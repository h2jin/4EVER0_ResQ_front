import React from 'react';
import {
  Box,
  Grid,
  InputLabel,
  TextField,
  Stack,
  Input,
  ButtonGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TimeField from '../../components/common/TimeField';
import SubHeader from '../../components/common/SubHeader';
import DaumPost from '../../components/car_user/DaumPost';
import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Typography from '@mui/material/Typography';
import CarList from '../../components/car_user/CarList';
import axios from 'axios';
import MainContainer from '../../components/mr_user/MainContainer';
import WrapContainer from '../../components/mr_user/WrapContainer';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@fullcalendar/core';
import dayjs from 'dayjs';
import SubSideContents from '../../components/car_user/SubsideContents';
import Label from '../../components/common/Label';

const Register = () => {
  const navigate = useNavigate();
  const [addressObj, setAddressObj] = useState({
    areaAddress: '',
    townAddress: ''
  });
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [carDetail, setCarDetail] = useState({
    id: '',
    car_name: '',
    accum_mileage: '',
    authority: '',
    fuel_type: '',
    fuel_effciency: '',
    car_address: ''
  });

  const [formData, setFormData] = useState({
    memDTO: {
      mem_code: 'MEM001'
    },
    carDTO: {
      car_code: ''
    },
    detail: '',
    est_mileage: 0,
    start_at: '',
    return_at: '',
    receipt_loc: '',
    return_loc: '',
    dest_loc: ''
  });

  //값이 변하면 formdata 값변경 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleTimeChange = (e, name) => {
    //const { name, value } = e;
    //console.log(name);
    //console.log(value);
    console.log(typeof e.$d);
    setFormData({
      ...formData,
      [name]: e.$d
    });
  };
  //submit하는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    var flag = 0;
    if (formData.carDTO.car_code === '') {
      alert('차량을 선택하세요');
      flag++;
    }
    if (formData.start_at === '' || formData.return_at === '') {
      alert('날짜를 선택하세요');
      flag++;
    }
    if (formData.return_loc === '' || formData.dest_loc === '') {
      alert('장소를 선택하세요');
      flag++;
    }
    if (flag === 0) {
      axios
        .post('http://localhost:8081/car_rez/rezSave', formData)
        .then((res) => {
          console.log('예약 완료 : ' + res.data);
          navigate('../carRezComplete', { state: res.data });
        });
    }
  };

  //modal여는 함수
  const handleOpenModal = () => {
    setOpen(true);
  };
  //modal 닫는 함수
  const handleCloseModal = (reason) => {
    if (reason === 'buttonClick') {
      // 특정 버튼을 클릭한 경우의 처리
      console.log('사용자가 버튼을 클릭하여 모달이 닫힘');
    }
    setOpen(false);
  };
  //차량 선택 후 처리
  const carSelect = () => {
    console.log(selectedRows);
    if (selectedRows.length !== 0) {
      //console.log(selectedRows.id);
      setFormData({
        ...formData,
        carDTO: { car_code: selectedRows.id },
        receipt_loc: selectedRows.car_address
      });
      setOpen(false);
    } else {
      alert('차량을 선택해주세요');
    }
    axios
      .get(`http://localhost:8081/car_rez/carDetail/${selectedRows}`)
      .then((res) => {
        setCarDetail({
          id: res.data.carVO.car_code,
          car_name: res.data.carVO.car_name,
          accum_mileage: res.data.accum_mileage,
          authority: res.data.carVO.authority,
          fuel_type: res.data.carVO.fuel_type,
          fuel_effciency: res.data.fuel_effciency,
          car_address: res.data.car_address
        });
      });
  };
  useEffect(() => {
    setFormData({
      ...formData,
      dest_loc: addressObj.areaAddress + addressObj.townAddress
    });
  }, [addressObj]);
  const hiddenStyle = {
    display: 'none'
  };
  return (
    <>
      <SubHeader title={'차량 예약'} />
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16 }}
        >
          <Grid item xs={6}>
            <Item>
              <Stack sx={{ rowGap: '10px' }}>
                {/* 이름 */}
                <Grid item container xs={12} spacing={2}>
                  <StyledLabelGrid item xs={1}>
                    <Label htmlFor={'mem_code'} text={'이름'} />
                  </StyledLabelGrid>
                  <Grid item xs={11}>
                    <TextField
                      id="mem_code"
                      variant="outlined"
                      placeholder="이름을 입력하세요"
                    />
                  </Grid>
                </Grid>

                {/* 부서 */}
                <Grid item container xs={12} spacing={2}>
                  <StyledLabelGrid item xs={1}>
                    <Label htmlFor={'dpt_name'} text={'부서'} />
                  </StyledLabelGrid>
                  <Grid item xs={11}>
                    <TextField
                      id="dpt_name"
                      variant="outlined"
                      placeholder="부서를 입력하세요"
                    />
                  </Grid>
                </Grid>

                {/* 직급 */}
                <Grid item container xs={12} spacing={2}>
                  <StyledLabelGrid item xs={1}>
                    <Label htmlFor={'position_name'} text={'직급'} />
                  </StyledLabelGrid>
                  <Grid item xs={11}>
                    <TextField
                      id="position_name"
                      variant="outlined"
                      placeholder="직급을 입력하세요"
                    />
                  </Grid>
                </Grid>

                {/* <Stack>
                <TextField
                  label="사번"
                  name="mem_code"
                  variant="outlined"
                  type="text"
                  style={hiddenStyle}
                  onChange={handleChange}
                  value={'MEM001'}
                />
                <NewFormControl>
                  <TextField label="이름" variant="outlined" type="text" />
                </NewFormControl>
                <NewFormControl>
                  <TextField label="부서" variant="outlined" type="text" />
                </NewFormControl>
                <NewFormControl>
                  <TextField label="직급" variant="outlined" type="text" />
                </NewFormControl>
                <NewFormControl>
                  <TextField
                    label="목적"
                    name="detail"
                    variant="outlined"
                    type="text"
                    onChange={handleChange}
                  />
                </NewFormControl>
                <Grid>
                  <NewFormControl>
                    <TimeField
                      withMonth={true}
                      label={'대여 날짜'}
                      name={'start_at'}
                      onChange={(e) => handleTimeChange(e, 'start_at')}
                      timeValue={dayjs()}
                    ></TimeField>
                  </NewFormControl>
                  ~
                  <NewFormControl>
                    <TimeField
                      withMonth={true}
                      label={'반납 날짜'}
                      name={'return_at'}
                      onChange={(e) => handleTimeChange(e, 'return_at')}
                      timeValue={dayjs()}
                    ></TimeField>
                  </NewFormControl>
                </Grid>
                <NewFormControl>
                  <InputLabel htmlFor="dest">목적지</InputLabel>
                  <Input
                    id="dest"
                    name="dest_loc"
                    type="text"
                    value={addressObj.areaAddress + addressObj.townAddress}
                    readOnly
                  />
                  <DaumPost setAddressObj={setAddressObj} />
                </NewFormControl>
                <NewFormControl>
                  <Button onClick={handleOpenModal}>차량 찾기</Button>
                  <Modal
                    open={open}
                    handleModal={(e, reason) => handleCloseModal(reason)}
                    modalTitle={'차량 찾기'}
                    content={
                      <SubSideContents setSelectedRows={setSelectedRows} />
                    }
                    buttons={
                      <ButtonGroup>
                        <Button onClick={carSelect}>선택</Button>{' '}
                        <Button onClick={handleCloseModal}>취소</Button>
                      </ButtonGroup>
                    }
                  />
                </NewFormControl>
                <NewFormControl>
                  <InputLabel htmlFor="est_mileage">예상 주행거리</InputLabel>
                  <Input
                    id="est_mileage"
                    name="est_mileage"
                    type="number"
                    onChange={handleChange}
                  />
                </NewFormControl>
              </Stack> */}
              </Stack>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Typography
                variant="h7"
                component="div"
                sx={{ flexGrow: 1, color: '#000' }}
              >
                차량 정보
              </Typography>
              <NewFormControl>
                <InputLabel htmlFor="car_name">차종</InputLabel>
                <Input
                  id="car_name"
                  type="text"
                  value={carDetail.car_name}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl>
                <InputLabel htmlFor="car_code">차량 번호</InputLabel>
                <Input
                  id="car_code"
                  name="car_code"
                  type="text"
                  //onChange={handleChange}
                  value={carDetail.id}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl>
                <InputLabel htmlFor="accum_mileage">누적 주행 거리</InputLabel>
                <Input
                  id="accum_mileage"
                  type="text"
                  value={carDetail.accum_mileage}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl>
                <InputLabel htmlFor="authority">권한</InputLabel>
                <Input
                  id="authority"
                  type="text"
                  value={carDetail.authority}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl>
                <InputLabel htmlFor="fuel_type">유종</InputLabel>
                <Input
                  id="fuel_type"
                  type="text"
                  value={carDetail.fuel_type}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl>
                <InputLabel htmlFor="fuel_effciency">연비</InputLabel>
                <Input
                  id="fuel_effciency"
                  type="text"
                  value={carDetail.fuel_effciency}
                  readOnly
                />
              </NewFormControl>

              <NewFormControl>
                <InputLabel htmlFor="receipt_loc">인수지</InputLabel>
                <Input
                  id="receipt_loc"
                  name="receipt_loc"
                  type="text"
                  //onChange={handleChange}
                  value={carDetail.car_address}
                  readOnly
                />
              </NewFormControl>
              <NewFormControl sx={{ minWidth: 240 }}>
                <InputLabel id="demo-simple-select-label">반납지</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="return_loc"
                  name="return_loc"
                  label="반납지"
                  onChange={handleChange}
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  <MenuItem value={'강원특별자치도 춘천시 남산면 버들1길 130'}>
                    본사
                  </MenuItem>
                  <MenuItem value={'서울특별시 중구 을지로1가 을지로 29'}>
                    을지로
                  </MenuItem>
                  <MenuItem value={'부산 해운대구 센텀중앙로 79'}>
                    부산
                  </MenuItem>
                </Select>
              </NewFormControl>
            </Item>
          </Grid>
        </Grid>
        <BottomBox>
          <Button
            variant="contained"
            color="success"
            style={{ marginRight: '10px' }}
            type="submit"
          >
            예약
          </Button>
          <Button variant="outlined" color="error">
            Error
          </Button>
        </BottomBox>
      </form>
    </>
  );
};
export default Register;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 700
}));

const BottomBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 5,
  marginRight: 16
}));

const NewFormControl = styled(FormControl)(({ theme }) => ({
  textAlign: 'left',
  margin: 7
}));

const StyledLabelGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center'
}));
