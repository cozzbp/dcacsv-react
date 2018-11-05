import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import * as Papa from 'papaparse';

import TextInput from '../forms/text-input';
import { colors } from '../theme/theme';

const HomeWrapper = styled.div`
  font-family: "Roboto";
  text-align: center;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Header = styled.h2`
  font-size: 35px;
  margin: 20px 0 40px 0;
`;

const Subheader = styled.h3`
  font-size: 20px;
`;

const Button = styled.button`
  font-family: "Roboto";
  font-size: 20px;
  font-weight: 500;
  color: ${colors.white};
  background-color: ${colors.blue};
  border: none;
  height: 45px;
  border-radius: 2px;
  padding: 0 10px;
  margin-left: 5px;
  flex-shrink: 0;
  min-width: 90px;
  &:hover {
    color: ${colors.white60};
  }
  cursor: pointer;

  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

const SubmitButton = styled(Button)`
  align-self: center;
  margin-top: 50px;
`;

const InputField = styled.div`
  display: flex;
  align-items: center;
`;

const ImageWrapper = styled.img`
  width: 300px;
  box-shadow: 5px 5px rgba(0,0,0, 0.2);
  border-radius: 2px;
  float: left;
  
  margin-right: 10px;
  &:before {
    background-color: green;
  }
`;

const FILE1 = 'FILE1';
const HIT1 = 'HIT1';
const FILE2 = 'FILE2';
const HIT2 = 'HIT2';

export default class LandingPage extends React.Component {

  importFiles = key => type => () => {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = type;
    inputEl.value = '';
    inputEl.addEventListener('change', this.handleFile.bind(null, inputEl, key));
    inputEl.click();
  }

  handleFile = (inputEl, key) => {
    this.importCSV(inputEl.files, key);
    inputEl.remove();
  }

  importCSV = (files, key) => {
    const firstFile = _.head(files);
    const allowedFileTypes = /.+(\.csv|\.txt)$/;
    if (_.isEmpty(firstFile.name) || !firstFile.name.match(allowedFileTypes)) {
      console.error('File must be a .csv or .txt file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      // reader.result
      this.setState({
        [key]: {
          fileName: firstFile.name,
          data: reader.result,
        }
      });
    };

    reader.readAsText(firstFile);
  };

  getStripped = (value) => {
    const split = _.split(value, ' ');
    let finalName = '';
    _.forEach(split, (value, i) => {
      if (i === 0) {
        finalName = value;
      } else if (!/[A-Z|\d]/.test(value)) {
        finalName += ` ${value}`;
      } else {
        return false;
      }
    });
    return finalName;
  }

  buildMap = (file, hitFile) => {
    const split = _.split(file, '>');
    const mapped = {};
    const parsed = Papa.parse(hitFile);
    const hitMap = {};

    _.forEach(parsed.data, (value) => {
      hitMap[_.get(value, '[1]')] = _.get(value, '[2]');
    });

    _.forEach(split, (value) => {
      const matches = value.match(/\[(.*)\]/);
      const name = _.get(matches, '[1]', '');
      const key = this.getStripped(name);
      if (_.isEmpty(key) || _.includes(value, 'LOW QUALITY PROTEIN') || _.includes(value, 'partial')) {
        return;
      }

      const accession = _.get(_.split(value, ' '), '[0]');
      const seq = value.substring(value.indexOf('\n')).replace(/\n/g, '');
      const full = value.replace(/\n/g, '');

      const hit = hitMap[accession];

      const existing = mapped[key];
      if (_.isEmpty(existing)) {
        mapped[key] = {
          OrganismName: name,
          Sequence: seq,
          Full: full,
          Hit: hit,
        };
      } else if (hit > existing.Hit) {
        mapped[key] = {
          OrganismName: name,
          Sequence: seq,
          Full: full,
          Hit: hit,
        };
      }
    });

    return mapped;
  }

  processFiles = () => {
    const mapped1 = this.buildMap(_.get(this.state, '[FILE1].data', ''), _.get(this.state, '[HIT1].data', ''));
    const mapped2 = this.buildMap(_.get(this.state, '[FILE2].data', ''), _.get(this.state, '[HIT2].data', ''));

    const final = [];
    _.forEach(mapped1, (value, key) => {
      const val2 = mapped2[key];
      if (!_.isEmpty(val2)) {
        final.push({
          ShortName: key,
          Organism1: value.OrganismName,
          PERCENTIDENT1: value.Hit,
          FILE1: value.Full,
          Organism2: val2.OrganismName,
          PERCENTIDENT2: val2.Hit,
          FILE2: val2.Full
        });
      }
    });
    this.downloadTxtFile(Papa.unparse(final));
  }

  downloadTxtFile = (data) => {
    const csvFile = new Blob([data], { type: 'text/csv' });
    const csvURL = window.URL.createObjectURL(csvFile);
    const link = document.createElement('a');
    link.setAttribute('href', csvURL);
    link.setAttribute('download', 'file.csv');
    link.click();
  }

  render() {
    return (
      <HomeWrapper>
        <Header></Header>
        <InputField>
          <ImageWrapper src={'images/fasta.JPG'}/>
          <ImageWrapper src={'images/csv.JPG'}/>
        </InputField>
        <InputField>
          <Subheader>
            First Fasta Text File
          </Subheader>
          <TextInput disabled value={_.get(this.state, '[FILE1].fileName', '')} valid={_.get(this.state, '[FILE1].data', true)}/>
          <Button onClick={this.importFiles(FILE1)('.txt')}>Upload</Button>
        </InputField>
        <InputField>
          <Subheader>
            First Hit CSV File
          </Subheader>
          <TextInput disabled value={_.get(this.state, '[HIT1].fileName', '')} valid={_.get(this.state, '[HIT1].data', true)}/>
          <Button onClick={this.importFiles(HIT1)('.csv')}>Upload</Button>
        </InputField>

        <InputField>
          <Subheader>
            Second Fasta Text File
          </Subheader>
          <TextInput disabled value={_.get(this.state, '[FILE2].fileName', '')} valid={_.get(this.state, '[FILE2].data', true)}/>
          <Button onClick={this.importFiles(FILE2)('.txt')}>Upload</Button>
        </InputField>
        <InputField>
          <Subheader>
          Second Hit CSV File
          </Subheader>
          <TextInput disabled value={_.get(this.state, '[HIT2].fileName', '')} valid={_.get(this.state, '[HIT2].data', true)}/>
          <Button onClick={this.importFiles(HIT2)('.csv')}>Upload</Button>
        </InputField>
        <SubmitButton onClick={this.processFiles}>Submit</SubmitButton>
      </HomeWrapper>
    );
  }
}
