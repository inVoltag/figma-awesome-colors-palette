import * as React from 'react';
import Slider from './Slider';
import Switch from './Switch';
import Button from './Button';
import { palette } from '../data';

interface Props {
  isPaletteSelected: boolean;
  scale: string;
  hasCaptions: boolean
};

export default class UpdatePalette extends React.Component<Props> {

  // Events
  slideHandler = () => {
    parent.postMessage({ pluginMessage: { type: 'update-palette', palette } }, '*');
  }

  checkHandler = (e: any) => {
    this.setState({ hasCaption: e.target.checked })
  }

  // Templates
  Message = () => {
    return (
      <div className='message'>
        <div className='onboarding-tip'>
          <div className='icon icon--warning'></div>
          <div className='onboarding-tip__msg'>Select an Awesome palette to update its lightness scale</div>
        </div>
      </div>
    )
  }

  Scale = () => {
    return (
      <>
      <div className='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        <Slider
          type='CUSTOM'
          knobsList=''
          min=''
          max=''
          scale={this.props.scale}
          onChange={this.slideHandler}
        />
        <div className='onboarding-tip'>
          <div className='icon icon--library'></div>
          <div className='onboarding-tip__msg'>Hold Shift ⇧ while dragging 50 or 900 to distribute knobs' horizontal spacing</div>
          <div className='onboarding-tip__msg'>Hold Ctrl or Cmd ⌘ while dragging a scale to shift every one</div>
        </div>
      </div>
      <div className='actions'>
        <Button type='primary' label='Update local styles' action={null} />
        <Switch id='showCaptions' label='Show captions' isChecked={this.props.hasCaptions} onChange={this.checkHandler} />
      </div>
      </>
    )
  }

  render() {
    return (
      <section>
        {this.props.isPaletteSelected == false ? <this.Message /> : null}
        {this.props.isPaletteSelected == true ? <this.Scale /> : null}
      </section>
    )
  }

}
