
import React from 'react';
import axios from 'axios';
import InputMatch from './components/Input';
import ErrorMessage from './components/error';
import RadioInput from './components/RadioInput';
import Tag from './components/TagInput';
import SexualInput from './components/SexualInput';
import Geosuggest from 'react-geosuggest';
import { browserHistory } from 'react-router';

class EditProfile extends React.Component {
	_mounted = false;

    state = {
		serverResponse: null,
        firstname: null,
        lastname: null,
        mail: null,
        tags: null,
        gender: null,
		bio: null,
        orientation: null,
        locValue: 'Locate me',
        success: 0,
		location: null,
        imageSrc: [],
        addedTags: [],
		data: null,
		oldImgList: null,
    }

	componentWillMount() {
		axios({
			method: 'put',
			url: 'http://localhost:8080/checkuser',
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({data}) => {
			if (!this._mounted) return (false);
			if (data.status === false) {
				browserHistory.push('/login');
				return(<div> Loading </div>)
			}
		});
	};

	componentWillUnmount() {
		this._mounted = false
	};

    componentDidMount() {
		this._mounted = true;
		axios({
			method: 'get',
			url: 'http://localhost:8080/get_info',
			headers: {
				logToken: localStorage.getItem('logToken')
			}
		}).then(({ data }) => {
			if(!this._mounted) return (false);
			if (data) {
				this.setState({ data, imageSrc: data.image });
			}
			else {
				browserHistory.push('/login');
			}
		})
	};

    editProfile = async(e) => {
        e.preventDefault();
        e.persist();
		if (e.target.firstname.value.length > 30 ||
			e.target.lastname.value.length > 30 ||
			e.target.mail.value.length > 30) {
				e.target.firstname.value = '';
				e.target.lastname.value = '';
				e.target.mail.value = '';
			}
		const oldData = this.state.data;
		if (e.target.bio.value.length > 200)
			e.target.bio.value = '';
        this.setState({
            firstname: null,
            lastname: null,
            mail: null,
            serverResponse: null,
            tags: null,
            gender: null,
            orientation: null,
            succes: 0,
            bio: null,
			data: null,
        });
        const { location } = this.state;
        const response = await axios({
            method: 'post',
            url: 'http://localhost:8080/edit',
            data: {
				firstname: e.target.firstname.value,
				lastname: e.target.lastname.value,
				mail: e.target.mail.value,
				gender: e.target.gender.value,
				orientation: e.target.orientation.value,
				bio: e.target.bio.value,
				tags: this.refs.tag.state.addedTags,
				location,
            },
            headers: {
                logToken: localStorage.getItem('logToken')
            }
        });
        if (response.data.status === false) {
            const error = {};
			this.setState({ data: oldData });
            response.data.error.forEach((el) => {
                error[el.path] = el.error;
            });
            this.setState({ ...error });
        } else {
			this.setState({ data: response.data.newUser });
			browserHistory.push('/matcha/board');
        }
    };



    getLocation = async(e) => {
        e.preventDefault();
		if (this.state.location) {
			this.setState({ locValue: 'Already Entered' })
			return (false);
		}
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async(position) => {
                const posY = position.coords.latitude;
                const posX = position.coords.longitude;
                this.setState({
                    location: {
                        lon: posX,
                        lat: posY,
                    }
                });
                const google = await axios({
					method: 'get', url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${posY},${posX}`
				});
                if (google.data.status === 'OK') {
                    this.setState({
						locValue: google.data.results[0].formatted_address,
						location: {
							...this.state.location,
							address: google.data.results[5].formatted_address,
						}
					});
                } else {
                    this.setState({locValue: 'Cannot locate you'});
                }
            });
        } else {
            this.setState({locValue: 'Cannot locate you'});
        }
    };

	setAddress = async (e) => {
		if (e.label.length > 0) {
			const google = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.label}`);
			if (google.data.status === "OK") {
				const { lat, lng } = google.data.results[0].geometry.location;
				this.setState({ location: { lat, lon: lng, address: google.data.results[0].formatted_address }});
			}
		}
	};

	bioLimit = (e) => {
		if (e.target.value.length > 200)
			e.target.value = '';
	};

	removeImg = (key, name) => {
        const newImages = this.state.imageSrc;
        newImages.splice(key, 1);
        this.setState({imageSrc: newImages});
		axios({
			method: 'put',
			url: 'http://localhost:8080/removeImage',
			data: {
				image: name,
			},
			headers: {
				logToken: localStorage.getItem('logToken'),
			},
		}).catch(() => console.log('AN ERROR OCCURRED'));
    }

	addPhoto = (e) => {
		const img = new Image();
		e.persist();
		img.onload = () => {
			const data = new FormData();
			data.append('image', e.target.files[0]);
			axios({
				url: 'http://localhost:8080/addimage',
				method: 'post',
				data,
				headers: {
					logToken: localStorage.getItem('logToken'),
					'Content-type': 'multipart/form-data',
				}
			}).then(({ data }) => {
				if (data.status === false && data.details === 'trop dimg') {
					alert('5 pictures max');
				} else {
					this.setState({ imageSrc: [...this.state.imageSrc, data.image] })
				}
			}).catch(() => this.setState({ serverResponse: 'AN ERROR OCCURRED' }));
		}
		if (e.target.files[0]) {
			const _URL = window.URL || window.webkitURL;
			img.src = _URL.createObjectURL(e.target.files[0]);
		}
	};

    render() {
        const {
            firstname,
            lastname,
            mail,
            serverResponse,
            locValue,
            bio,
			gender,
			orientation,
            imageSrc,
			data,
        } = this.state;

        const imgList = imageSrc.map((src, key) => <div key={key}>
            <div onDoubleClick={(e) => this.removeImg(key, src)} className="imageProfile" style={{
                backgroundImage: `url('http://localhost:8080/public/${src}')`,
            }}/>
        </div>);
        return (
            <div className="EditProfile">
                <form onSubmit={this.editProfile}>
                    <div className='logError'>{serverResponse}</div>
                    {data && <div>
					<InputMatch name="firstname" type="text" label="Firstname" valDef={data.firstname}>
                        <ErrorMessage>{firstname}</ErrorMessage>
                    </InputMatch>
                    <InputMatch name="lastname" type="text" label="Lastname" valDef={data.lastname}>
                        <ErrorMessage>{lastname}</ErrorMessage>
                    </InputMatch>
                    <InputMatch name="mail" type="text" label="Email" valDef={data.mail}>
                        <ErrorMessage>{mail}</ErrorMessage>
                    </InputMatch>
					<InputMatch name="bio" type="text" label="Biography" valDef={data.bio} bioLimit={this.bioLimit} autoComplete="off">
                        <ErrorMessage>{bio}</ErrorMessage>
                    </InputMatch>
                    <RadioInput label="Gender" name="gender" value1="female" value2="male" checked={data.gender}>
                        <ErrorMessage>{gender}</ErrorMessage>
                    </RadioInput>

                    <SexualInput label="Orientation"  name="orientation" value1="gay" value2="bisexual" value3="straight" checked={data.orientation}>
                        <ErrorMessage>{orientation}</ErrorMessage>
                    </SexualInput>

                    <Tag name="tag" type="text" tagList={data.tags} label="Tags" ref="tag" className='tagLists' />
					</div>}
					<div className='GeoLocTout'>
					<Geosuggest
						className="test"
						onSuggestSelect={this.setAddress}
						placeholder="Enter Your Address!"
					/>Or
                    <button className='geolocButton' type='button' onClick={this.getLocation}>{locValue}</button>
					</div>
					<input className='submitButton2' type='submit' name='send'/><br /><br /><br /><br />
				</form>
				<form action="" method="post">
					<div className="upload">Add photo To your Profile
						<input className='fileButton' type='file' onChange={this.addPhoto} />
						<ul className='imagesDisplays'>{imgList}</ul>
					</div>
				</form>
            </div>
        )
    };
}

export default EditProfile;
