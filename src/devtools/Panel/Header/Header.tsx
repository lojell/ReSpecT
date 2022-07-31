import React, { FC } from 'react'
import ScanIco from '../../../assets/scan.svg';
import LogoMarkIco from '../../../assets/logoMark.svg';

import { Link, Center, Container, Controls, Logo, Divider } from './styles';

const Header: FC = () => {

  return (
    <Container>
      <Logo><LogoMarkIco /></Logo>
      <Divider />
      <Center></Center>
      <Controls>
        <Link href='https://github.com/lojell/ReSpecT/issues' target='_blank'>Leave feedback</Link>
        {/* <ButtonLink>
          <ScanIco />
          RUN SWAGGER SCAN
        </ButtonLink> */}
      </Controls>
    </Container>
  )
}

export default Header;
