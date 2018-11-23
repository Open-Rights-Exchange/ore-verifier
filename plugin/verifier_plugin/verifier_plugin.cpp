#include <eosio/verifier_plugin/verifier_plugin.hpp>
#include <eosio/verifier_plugin/account_control_verifier_object.hpp>
#include <eosio/verifier_plugin/public_key_verifier_object.hpp>
#include <eosio/chain/controller.hpp>
#include <eosio/chain/trace.hpp>
#include <eosio/chain_plugin/chain_plugin.hpp>
#include <fc/io/json.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/signals2/connection.hpp>
#include <string>
#include <iostream>
#include "jwt/jwt.hpp"
namespace eosio { 
   using namespace chain;
   using boost::signals2::scoped_connection;

   static appbase::abstract_plugin& _verifier_plugin = app().register_plugin<verifier_plugin>();
} /// namespace eosio

namespace eosio {

   class verifier_plugin_impl {
      public:
         bool bypass_filter = false;
         chain_plugin*          chain_plug = nullptr;
         fc::optional<scoped_connection> applied_transaction_connection;

   };

   verifier_plugin::verifier_plugin()
   :my(std::make_shared<verifier_plugin_impl>()) {
   }

   verifier_plugin::~verifier_plugin() {
   }

   void verifier_plugin::set_program_options(options_description& cli, options_description& cfg) {
   }

   void verifier_plugin::plugin_initialize(const variables_map& options) {

   }

   void verifier_plugin::plugin_startup() {
         ilog("starting verifier_plugin");
   }

   void verifier_plugin::plugin_shutdown() {
   }

   namespace verifier_apis { 

      std::string read_from_file(const std::string& path)
      {
            std::string contents;
            std::ifstream is{path, std::ifstream::binary};

            if (is) {
                  // get length of file:
                  is.seekg (0, is.end);
                  auto length = is.tellg();
                  is.seekg (0, is.beg);
                  contents.resize(length);

                  is.read(&contents[0], length);
                  if (!is) {
                        is.close();
                        return {};
                   }
            } else {
                  std::cerr << "FILE not FOUND!!" << std::endl;
            }

            is.close();
            return contents;
      }

      read_only::get_access_token_results read_only::get_access_token(const get_access_token_params& params) const {
            get_access_token_results result;

            const std::string priv_key_path =  std::string{CERT_ROOT_DIR} + "/jwtRS256.key";
            auto priv_key = read_from_file(priv_key_path);

            jwt::jwt_object obj{jwt::params::algorithm("rs256"), jwt::params::secret(priv_key), jwt::params::payload({{"user", "admin"}})};
            
            auto enc_str = obj.signature();
            result.access_token = enc_str;
            return result;
      }
   } /// verifier_apis
} /// namespace eosio
