import * as React from 'react';
import FormItem from './../components/FormItem';
import Input from './../components/Input';

interface Props {
  paletteName: string
};

export default class Settings extends React.Component<Props> {

  render() {
    return (
      <div className='settings controls__control'>
        <div className='settings__group'>
          <div className='section-controls'>
            <div className='section-title'>Base information</div>
          </div>
          <div className='settings__item'>
            <FormItem
              label='Palette name'
              id='rename-palette'
            >
              <Input
                type='text'
                icon={{type: 'none', value: null}}
                placeholder={this.props.paletteName != '' ? 'UI Color Palette' : null}
                value={this.props.paletteName != '' ? this.props.paletteName : null}
                min=''
                max=''
                feature='rename-palette'
                onChange={null}
                onFocus={null}
              />
            </FormItem>
          </div>
        </div>
      </div>
    )
  }

}
