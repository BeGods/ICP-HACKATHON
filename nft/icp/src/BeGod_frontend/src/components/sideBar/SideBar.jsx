import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { LuCopyPlus } from 'react-icons/lu';
import { CiUser } from 'react-icons/ci';
import { FiMenu } from 'react-icons/fi';
import { CopyIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser, logoutUserAndClear } from '../../redux/authSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import {Link} from "react-router-dom"
const sideBarData = [
  {
    text: "Dashboard",
    icon: MdOutlineDashboard,
    Link: "/admin/dashboard"
  },
  {
    text: "Collection",
    icon: LuCopyPlus,
    Link: "/admin/collection"
  },
  {
    text: "Users",
    icon: CiUser,
    Link: "/admin/users"
  }
];

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box h={{ base: "fit-content", md: "screen" }} bg={useColorModeValue('#161618', '#29292C')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
      </Box>
    </Box>
  );
}

function SidebarContent({ onClose, ...rest }) {
  const loc = useLocation();
  const location = loc.pathname;
  const [hovered, setHovered] = useState(false);
  const [Copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const logoutHandler = () => {
    dispatch(logoutUserAndClear());
  }
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <Box
      bg={useColorModeValue('#29292C', 'gray.900')}
      w={{ base: 'full', md: 60,'2xl':80}}
      pos="fixed"
      h="full"
      display={{ md: "flex" }}
      flexDirection={{ md: "row" }}
      justifyContent={{ md: "space-evenly" }}
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: 'flex', md: 'none' }} color="white" onClick={onClose} />
      </Flex>
      <div className='h-[90%] flex flex-col justify-between'>
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          {sideBarData.map((link) => (
            <NavItem key={link.text} icon={link.icon} href={link.Link} isActive={location.toLowerCase().includes(link.Link.toLowerCase())} hovered={hovered}>
              {link.text}
            </NavItem>
          ))}
        </div>
        <div className='flex items-center justify-start gap-x-4 px-8 text-white'>
          <img className='w-12 h-12' src="/image/admin.png" alt="Admin" />
          <div className='space-y-2'>
            <div className='flex gap-x-2'>
              <p className='text-base'>Admin</p>
              <button onClick={() => logoutHandler()}>
                <Icon as={MdLogout} />
              </button>
            </div>
            <div className='flex flex-col'>
              <div>
                <input value={`${user.slice(0, 5)}......${user.slice(user.length - 6)}`} readOnly className='text-white w-[70%] bg-inherit' />
                <CopyToClipboard text={`${user.slice(0, 5)}.....${user.slice(user.length - 6)}`} onCopy={handleCopy}>
                  <button className=''><CopyIcon /></button>
                </CopyToClipboard>
              </div>
              {Copied && <p>Copied!</p>}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function NavItem({ icon, children, href, isActive, hovered, ...rest }) {
  return (
    <Box
      as={Link}
      to={href}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      {...rest}
    >
      <Flex
        align="center"
        font="bold"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        color={isActive && !hovered?"black":"white"}
        cursor="pointer"
        bg={isActive?'#FCD37B':''}
        _hover={{
          bg: '#FCD37B',
          color: 'black',
        }}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'black',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function MobileNav({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('#161618', 'gray.900')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        color='white'
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
};
